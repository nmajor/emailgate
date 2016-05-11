import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';

import baseURL from '../../baseURL';
// import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';

export function addAddress(address) {
  return {
    type: ActionTypes.ADD_ADDRESS,
    address,
  };
}

// export function removeAddressFromAddresses(address) {
//   return {
//     type: ActionTypes.REMOVE_ADDRESS_FROM_ADDRESSES,
//     address,
//   };
// }

export function updateAddressInAddresses(address) {
  return {
    type: ActionTypes.UPDATE_ADDRESS_IN_ADDRESSES,
    address,
  };
}

export function setAddresses(addresses) {
  return {
    type: ActionTypes.SET_ADDRESSES,
    addresses,
  };
}

export function getAddresses(cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('addresses', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/addresses`, fetchOptions)
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

      dispatch(setPropertyForFetching('addresses', false));
      dispatch(setAddresses(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('addresses', false));
      console.log(err);
    });
  };
}

export function createAddress(addressProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/addresses`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(addressProps),
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

      dispatch(addAddress(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateAddress(id, addressProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/addresses/${id}`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(addressProps),
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

      dispatch(updateAddressInAddresses(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

// export function removeAddress(address) {
//   return (dispatch) => {
//     dispatch(updateAddressInAddresses(Object.assign({}, address, { saving: true })));
//     socket.emit('REMOVE_ADDRESS', address);
//   };
// }
