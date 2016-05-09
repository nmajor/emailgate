import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CartForm from '../components/CartForm';
import _ from 'lodash';

class CartFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  removeCartItem(props) {
    this.props.dispatch(Actions.removeItemFromCart(props._id));
  }
  updateCartItemQuantity(props) {
    this.props.dispatch(Actions.updateQuantityForCartItem(props._id, props.quantity));
  }
  renderCart() {
    if (!_.isEmpty(this.props.cart) && !_.isEmpty(this.props.config)) {
      return (<CartForm
        cart={this.props.cart}
        products={this.props.config.products}
        removeItem={this.removeCartItem}
        updateItemQuantity={this.updateCartItemQuantity}
      />);
    }
  }

  render() {
    return (<div>
      <h3>Cart</h3>
      {this.renderCart()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    cart: store.cart,
  };
}

CartFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CartFormContainer);
