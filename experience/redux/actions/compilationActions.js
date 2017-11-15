import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setCompilation(compilation) {
  return {
    type: ActionTypes.SET_COMPILATION,
    compilation,
  };
}

export function getCompilation(cookie, compilationId) {
  return (dispatch) => {
    // dispatch(setPropertyForFetching('compilations', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations/${compilationId}`, fetchOptions)
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

      // dispatch(setPropertyForFetching('compilations', false));
      dispatch(setCompilation(res));
    })
    .catch((err) => {
      // dispatch(setPropertyForFetching('compilations', false));
      console.log(err);
    });
  };
}
