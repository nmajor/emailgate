import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
import baseURL from '../../../shared/baseURL';
import socket from '../../../client/socket';

export function setCompilations(compilations) {
  return {
    type: ActionTypes.SET_COMPILATIONS,
    compilations,
  };
}

export function appendToCompilationLog(compilationId, entry) {
  return {
    type: ActionTypes.APPEND_TO_COMPILATION_LOG,
    compilationId,
    entry,
  };
}

export function updateCompilationInCompilations(compilation) {
  return {
    type: ActionTypes.UPDATE_COMPILATION_IN_COMPILATIONS,
    compilation,
  };
}

export function getCompilations(cookie) {
  return (dispatch) => {
    // dispatch(setPropertyForFetching('compilations', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/compilations`, fetchOptions)
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
      dispatch(setCompilations(res));
    })
    .catch((err) => {
      // dispatch(setPropertyForFetching('compilations', false));
      console.log(err);
    });
  };
}

export function buildCompilationPdf(compilationId) {
  return () => {
    socket.emit('BUILD_COMPILATION_PDF', { compilationId });
  };
}