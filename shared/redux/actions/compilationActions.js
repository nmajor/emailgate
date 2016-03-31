import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';

// ACTIONS
export function addCompilation(compilation) {
  return {
    type: ActionTypes.ADD_COMPILATION,
    compilation,
  };
}

export function setCompilations(compilations) {
  return {
    type: ActionTypes.SET_COMPILATIONS,
    compilations,
  };
}

// THUNKS
export function createCompilation(props, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/compilations`, {
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

      dispatch(addCompilation(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function getCompilations(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations`, fetchOptions)
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

      dispatch(setCompilations(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
