import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationAddToCart from '../components/CompilationAddToCart';
import CartViewContainer from './CartViewContainer';
import * as Actions from '../redux/actions/index';
import { compilationTotalPageCount } from '../helpers';
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
  compilationTotalPageCount() {
    return compilationTotalPageCount(this.props.compilationEmails, this.props.compilationPages);
  }
  renderCartView() {
    if (_.get(this.props.cart, 'items.length') > 0) {
      return (<div className="row">
        <div className="col-md-12">
          <div className="padded-box">
            <CartViewContainer />
          </div>
        </div>
      </div>);
    }
  }
  renderAddToCart() {
    return (<div className="row">
      <div className="col-md-12">
        <div className="padded-box bottom-bumper">
          <CompilationAddToCart
            compilation={this.props.compilation}
            compilationEmailsCount={this.props.compilationEmails.length}
            compilationTotalPageCount={this.compilationTotalPageCount()}
            submitForm={this.addToCart}
            products={this.compilationProducts()}
          />
        </div>
      </div>
    </div>);
  }

  render() {
    return (<div>
      {this.renderAddToCart()}
      {this.renderCartView()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
    cart: store.cart,
  };
}

CompilationCheckoutContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationCheckoutContainer);
