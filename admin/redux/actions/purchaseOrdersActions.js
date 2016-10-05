import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setPurchaseOrders(purchaseOrders) {
  return {
    type: ActionTypes.SET_PURCHASE_ORDERS,
    purchaseOrders,
  };
}

export function addPurchaseOrder(purchaseOrder) {
  return {
    type: ActionTypes.ADD_PURCHASE_ORDER,
    purchaseOrder,
  };
}

export function getPurchaseOrders(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/purchase-orders`, fetchOptions)
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

      dispatch(setPurchaseOrders(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function createPurchaseOrder(props, cb) {
  cb = cb || function() {} // eslint-disable-line

  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/purchase-orders`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(props),
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

      dispatch(addPurchaseOrder(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
