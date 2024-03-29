import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationAddToCartContainer from './CompilationAddToCartContainer';
// import CartViewContainer from './CartViewContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class CompilationCheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.back = this.back.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const items = nextProps.cart.items || [];
    const cartHasCompilation = _.some(items, (item) => { return item.props.compilationId === this.props.compilation._id; });

    if (cartHasCompilation) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/post-next`);
    }
  }
  addToCart(props) {
    this.props.dispatch(Actions.addCartItem(props.productId, props.quantity, {
      compilationId: this.props.compilation._id,
      compilationTitle: this.props.compilation.title,
      compilationSubtitle: this.props.compilation.subtitle,
    }));
  }
  compilationProducts() {
    const products = _.filter(this.props.config.products, (product) => {
      return product.tags.indexOf('compilation') > -1;
    });
    return products;
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  render() {
    return (<div className="container compilation-container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="compilation-content-box">
            <h1 className="text-center">Add To Cart</h1>
            <CompilationAddToCartContainer
              compilation={this.props.compilation}
              compilationEmailsCount={this.props.compilationEmails.length}
              submitForm={this.addToCart}
              products={this.compilationProducts()}
            />
          </div>
        </div>
      </div>
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

CompilationCheckoutContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationCheckoutContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CompilationCheckoutContainer);
