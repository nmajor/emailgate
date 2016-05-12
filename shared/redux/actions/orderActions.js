import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';

import baseURL from '../../baseURL';
// import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';

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
      if (res.error) {
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
