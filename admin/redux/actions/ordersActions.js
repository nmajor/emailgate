import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setOrders(orders) {
  return {
    type: ActionTypes.SET_ORDERS,
    orders,
  };
}

export function getOrders(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/orders`, fetchOptions)
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

      dispatch(setOrders(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
