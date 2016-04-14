import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';

// import baseURL from '../../baseURL';
// import socket from '../../../client/socket';

// Account Actions
export function setPasswordInAccountPasswordMap(account, password) {
  return {
    type: ActionTypes.SET_PASSWORD_IN_ACCOUNT_PASSWORD_MAP,
    account,
    password,
  };
}
