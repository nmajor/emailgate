import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationAddToCart from '../components/CompilationAddToCart';
import CartFormContainer from './CartFormContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationCheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.addToCart = this.addToCart.bind(this);
  }
  addToCart(props) {
    this.props.dispatch(Actions.addCartItem(1, props.quantity, {
      compilationId: this.props.compilation._id,
      compilationName: this.props.compilation.name,
    }));
  }
  compilationProducts() {
    const products = _.filter(this.props.config.products, (product) => {
      return product.tags.indexOf('compilation') > -1;
    });
    return products;
  }
  renderCartForm() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return (<div className="col-md-6">
        <div className="padded-box">
          <CartFormContainer />
        </div>
      </div>);
    }
  }

  render() {
    return (<div className="row">
      <div className="col-md-6">
        <div className="padded-box">
          <CompilationAddToCart
            compilation={this.props.compilation}
            compilationEmailsCount={this.props.compilationEmails.length}
            submitForm={this.addToCart}
            products={this.compilationProducts()}
          />
        </div>
      </div>
      {this.renderCartForm()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    compilationEmails: store.compilationEmails,
    cart: store.cart,
  };
}

CompilationCheckoutContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationCheckoutContainer);
