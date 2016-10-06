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

export function updatePurchaseOrderInPurchaseOrders(purchaseOrder) {
  return {
    type: ActionTypes.UPDATE_PURCHASE_ORDER_IN_PURCHASE_ORDERS,
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

export function addOrderToPurchaseOrder(purchaseOrderId, orderId, cb) {
  cb = cb || function() {}; // eslint-disable-line

  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/purchase-orders/${purchaseOrderId}/add-order`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({ orderId }),
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

      dispatch(updatePurchaseOrderInPurchaseOrders(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function removeOrderFromPurchaseOrder(purchaseOrderId, orderId, cb) {
  cb = cb || function() {}; // eslint-disable-line

  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/purchase-orders/${purchaseOrderId}/remove-order`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({ orderId }),
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

      dispatch(updatePurchaseOrderInPurchaseOrders(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function rebuildPurchaseOrderRequest(purchaseOrderId, cb) {
  cb = cb || function() {}; // eslint-disable-line

  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/purchase-orders/${purchaseOrderId}/rebuild-request`, {
      credentials: 'include',
      method: 'post',
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

      dispatch(updatePurchaseOrderInPurchaseOrders(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
