import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';

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

export function setPropertyForCompilation(compilationId, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_COMPILATION,
    compilationId,
    prop,
    val,
  };
}

export function updateCompilationInCompilations(compilation) {
  return {
    type: ActionTypes.UPDATE_COMPILATION_IN_COMPILATIONS,
    compilation,
  };
}

// THUNKS
export function createCompilation(props, cb) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('newCompilation', true));

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

      dispatch(setPropertyForFetching('newCompilation', false));
      dispatch(addCompilation(res));
      cb(res);
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('newCompilation', false));
      console.log(err);
    });
  };
}

export function getCompilations(cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('compilations', true));

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

      dispatch(setPropertyForFetching('compilations', false));
      dispatch(setCompilations(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('compilations', false));
      console.log(err);
    });
  };
}

export function buildCompilationPdf(compilationId) {
  return (dispatch) => {
    dispatch(setPropertyForCompilation(compilationId, 'buildingPdf', true));
    socket.emit('BUILD_COMPILATION_PDF', { compilationId });
  };
}
