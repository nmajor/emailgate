import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setPromoCodes(promoCodes) {
  return {
    type: ActionTypes.SET_PROMO_CODES,
    promoCodes,
  };
}

export function addPromoCode(promoCode) {
  return {
    type: ActionTypes.ADD_PROMO_CODE,
    promoCode,
  };
}

export function removePromoCode(promoCode) {
  return {
    type: ActionTypes.REMOVE_PROMO_CODE,
    promoCode,
  };
}

export function getPromoCodes(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/promo-codes`, fetchOptions)
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

      dispatch(setPromoCodes(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function createPromoCode(props, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/promo-codes`, {
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
      if (!res.errors) {
        dispatch(addPromoCode(res));
      }

      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
