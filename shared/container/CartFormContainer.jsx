import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CartForm from '../components/CartForm';
import _ from 'lodash';

class CartFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeCartItem = this.removeCartItem.bind(this);
    this.updateCartItem = this.updateCartItem.bind(this);
  }
  removeCartItem(cartItem) {
    this.props.dispatch(Actions.removeCartItem(cartItem._id));
  }
  updateCartItem(cartItem, props) {
    this.props.dispatch(Actions.updateCartItem(cartItem._id, props));
  }
  renderCart() {
    if (!_.isEmpty(this.props.cart) && !_.isEmpty(this.props.config)) {
      return (<CartForm
        cart={this.props.cart}
        products={this.props.config.products}
        removeItem={this.removeCartItem}
        updateItem={this.updateCartItem}
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
