import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';

import baseURL from '../../baseURL';
import socket from '../../../client/socket';

// Account Actions
export function addAccount(account) {
  return {
    type: ActionTypes.ADD_ACCOUNT,
    account,
  };
}

export function updateAccountInAccounts(account) {
  return {
    type: ActionTypes.UPDATE_ACCOUNT_IN_ACCOUNTS,
    account,
  };
}

export function setAccounts(accounts) {
  return {
    type: ActionTypes.SET_ACCOUNTS,
    accounts,
  };
}

export function setSelectAccount(id) {
  return {
    type: ActionTypes.SET_SELECTED_ACCOUNT,
    id,
  };
}

export function getAccounts(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/accounts`, fetchOptions)
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

      dispatch(setAccounts(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function getAccount(id, cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/accounts/${id}`, fetchOptions)
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

      return dispatch(addAccount(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function createAccount(accountProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/accounts`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(accountProps),
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

      dispatch(addAccount(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateAccount(id, accountProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/accounts/${id}`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(accountProps),
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

      dispatch(updateAccountInAccounts(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function checkAccountConnection(account) {
  console.log('checkAccountConnection');
  return (dispatch) => {
    socket.emit('CHECK_ACCOUNT_CONNECTION', account);
    dispatch(updateAccountInAccounts(Object.assign({}, account, { checkingConnection: true })));
  };
}

export function socketUpdateAccount(account) {
  return (dispatch) => {
    dispatch(updateAccountInAccounts(account));
  };
}
