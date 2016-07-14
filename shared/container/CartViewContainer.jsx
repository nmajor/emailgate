import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import CartView from '../components/CartView';
import _ from 'lodash';

class CartViewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeCartItem = this.removeCartItem.bind(this);
    this.updateCartItem = this.updateCartItem.bind(this);
    // this.props.dispatch(Actions.getCart());
  }
  removeCartItem(cartItem) {
    this.props.dispatch(Actions.removeCartItem(cartItem._id));
  }
  updateCartItem(cartItem, props) {
    this.props.dispatch(Actions.updateCartItem(cartItem._id, props));
  }
  renderCart() {
    if (!_.isEmpty(this.props.cart) && !_.isEmpty(this.props.config)) {
      return (<CartView
        cart={this.props.cart}
        products={this.props.config.products}
        removeItem={this.removeCartItem}
        updateItem={this.updateCartItem}
        editable={this.props.editable}
      />);
    }
  }

  render() {
    return (<div>
      {this.renderCart()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    cart: store.cart,
    checkout: store.checkout,
  };
}

CartViewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
  editable: PropTypes.bool,
};

export default connect(mapStateToProps)(CartViewContainer);