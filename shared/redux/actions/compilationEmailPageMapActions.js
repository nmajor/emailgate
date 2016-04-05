import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';

export function setCompilationEmailPageMap(pageMap) {
  return {
    type: ActionTypes.SET_COMPILATION_EMAIL_PAGE_MAP,
    pageMap,
  };
}

export function getCompilationEmailPageMap(compilationId, cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations/${compilationId}/email-page-map`, fetchOptions)
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

      dispatch(setCompilationEmailPageMap(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
