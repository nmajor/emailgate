import * as ActionTypes from '../constants';
import socket from '../../../client/socket';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';

export function setCart(val) {
  return {
    type: ActionTypes.SET_CART,
    val,
  };
}

export function setPropertyForCart(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_CART,
    prop,
    val,
  };
}

export function addItemToCart(productId, quantity, props) {
  return dispatch => {
    dispatch(setPropertyForCart('fetching', true));
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

export function getCart(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/cart`, fetchOptions)
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }

      dispatch(setCart(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
