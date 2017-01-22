import * as ActionTypes from '../constants';
import socket from '../../../client/socket';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import { setPropertyForFetching } from './fetchingActions';

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

export function setPropertyForCartItem(cartItemId, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_CART_ITEM,
    cartItemId,
    prop,
    val,
  };
}

export function addCartItem(productId, quantity, props) {
  return dispatch => {
    dispatch(setPropertyForCart('fetching', true));
    socket.emit('ADD_CART_ITEM', { productId, quantity, props });
  };
}

export function removeCartItem(cartItemId) {
  return dispatch => {
    dispatch(setPropertyForCart('fetching', true));
    dispatch(setPropertyForCartItem(cartItemId, 'fetching', true));
    socket.emit('REMOVE_CART_ITEM', { cartItemId });
  };
}

export function updateCartItem(cartItemId, newData) {
  return dispatch => {
    dispatch(setPropertyForCart('fetching', true));
    dispatch(setPropertyForCartItem(cartItemId, 'fetching', true));
    socket.emit('UPDATE_CART_ITEM', { cartItemId, newData });
  };
}

export function getCart(cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('cart', true));

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
      dispatch(setPropertyForFetching('cart', false));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('cart', false));
      console.log(err);
    });
  };
}

export function applyPromoCodeToCart(cartId, code, cb) {
  cb = cb || function() {} // eslint-disable-line

  return (dispatch) => {
    dispatch(setPropertyForFetching('cart', true));

    return fetch(`${baseURL}/api/cart/${cartId}/promo`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({ code }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.errors) {
        return cb(res.errors);
      }

      dispatch(setCart(res));
      dispatch(setPropertyForFetching('cart', false));
      cb(res);
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('cart', false));
      console.log(err);
    });
  };
}
