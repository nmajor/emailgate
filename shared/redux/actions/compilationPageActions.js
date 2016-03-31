import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';

export function setCompilationPages(pages) {
  return {
    type: ActionTypes.SET_COMPILATION_PAGES,
    pages,
  };
}

export function getCompilationPages(compilationId, cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations/${compilationId}/pages`, fetchOptions)
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

      dispatch(setCompilationPages(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function setPropertyForCompilationPage(email, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_COMPILATION_PAGE,
    email,
    prop,
    val,
  };
}

export function updateCompilationPage(compilationId, page, newData) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationPage(page, 'saving', true));
    socket.emit('UPDATE_COMPILATION_PAGE', {
      compilationId,
      pageId: page._id,
      newData,
    });
  };
}
