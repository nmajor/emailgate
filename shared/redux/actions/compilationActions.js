import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';
import { setPropertyForSomeFilteredAccountEmails } from './filteredAccountEmails';
import _ from 'lodash';

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

export function setCompilationEmails(emails) {
  return {
    type: ActionTypes.SET_COMPILATION_EMAILS,
    emails,
  };
}

export function addCompilationEmail(email) {
  return {
    type: ActionTypes.ADD_COMPILATION_EMAIL,
    email,
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

export function getCompilationEmails(compilationId, cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations/${compilationId}/emails`, fetchOptions)
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

      dispatch(setCompilationEmails(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function addEmailsToCompilationEmails(compilationId, emails) {
  return (dispatch) => {
    dispatch(setPropertyForSomeFilteredAccountEmails(_.map(emails, (email) => { return email.mid; }), 'saving', true));
    socket.emit('ADD_COMPILATION_EMAILS', { compilationId, emails });
  };
}
