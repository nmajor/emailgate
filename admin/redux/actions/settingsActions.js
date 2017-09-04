import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setSettings(settings) {
  return {
    type: ActionTypes.SET_SETTINGS,
    settings,
  };
}

export function getSettings(cookie) {
  return (dispatch) => {
    // dispatch(setPropertyForFetching('compilations', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/settings`, fetchOptions)
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

      dispatch(setSettings(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateSetting(name, data, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/admin/settings/${name}`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(data),
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
        dispatch(setSettings(res));
      }

      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
