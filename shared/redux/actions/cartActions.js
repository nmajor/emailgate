import * as ActionTypes from '../constants';
import socket from '../../../client/socket';

export function setCart(val) {
  return {
    type: ActionTypes.SET_CART,
    val,
  };
}

export function addItemToCart(productId, quantity, props) {
  return () => {
    socket.emit('ADD_ITEM_TO_CART', { productId, quantity, props });
  };
}

export function updateQuantityForCartItem(cartItemId, quantity) {
  return () => {
    socket.emit('UPDATE_QUANTITY_FOR_CART_ITEM', { cartItemId, quantity });
  };
}

export function removeItemFromCart(cartItemId) {
  return (dispatch) => {
    dispatch(updateQuantityForCartItem(cartItemId, 0));
  };
}
