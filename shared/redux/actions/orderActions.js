import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';

import baseURL from '../../baseURL';
// import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';
import { setPropertyForCheckout } from './checkoutActions';

export function addOrder(order) {
  return {
    type: ActionTypes.ADD_ORDER,
    order,
  };
}

export function updateOrderInOrders(order) {
  return {
    type: ActionTypes.UPDATE_ORDER_IN_ORDERS,
    order,
  };
}

export function setOrders(orders) {
  return {
    type: ActionTypes.SET_ORDERS,
    orders,
  };
}

export function getOrderPreview(orderProps, cb) {
  return (dispatch) => {
    dispatch(setPropertyForCheckout('orderPreview', { fetching: true }));

    return fetch(`${baseURL}/api/orders/preview`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(orderProps),
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
      dispatch(setPropertyForCheckout('orderPreview', res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function getOrders(cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('orders', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/orders`, fetchOptions)
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

      dispatch(setPropertyForFetching('orders', false));
      dispatch(setOrders(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('orders', false));
      console.log(err);
    });
  };
}

export function createOrder(orderProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/orders`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(orderProps),
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
      if (res.error && !res._id) {
        throw new Error(res.error.message);
      }

      dispatch(addOrder(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function applyPromoCodeToOrderPreview(order, code, cb) {
  cb = cb || function() {} // eslint-disable-line

  return (dispatch) => {
    const body = order;
    body.code = code;

    return fetch(`${baseURL}/api/orders/preview/promo`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        data: order.data,
        cartId: order.cartId,
        code,
      }),
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
      if (res.error) {
        return cb(res.error);
      }

      dispatch(setPropertyForCheckout('orderPreview', res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
