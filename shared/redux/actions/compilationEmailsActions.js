import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';

import {
  setPropertyForSomeFilteredAccountEmails,
  setPropertyForFilteredAccountEmail,
} from './filteredAccountEmails';

import _ from 'lodash';

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

export function removeCompilationEmail(email) {
  return {
    type: ActionTypes.REMOVE_COMPILATION_EMAIL,
    email,
  };
}

export function setPropertyForCompilationEmail(email, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_COMPILATION_EMAIL,
    email,
    prop,
    val,
  };
}

export function updateEmailInCompilationEmails(email) {
  return {
    type: ActionTypes.UPDATE_EMAIL_IN_COMPILATION_EMAILS,
    email,
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

export function removeEmailFromCompilationEmails(compilationId, email) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationEmail(email, 'saving', true));
    dispatch(setPropertyForFilteredAccountEmail(email, 'saving', true));
    socket.emit('REMOVE_COMPILATION_EMAIL', { compilationId, emailId: email._id });
  };
}

export function updateCompilationEmail(compilationId, email, newData) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationEmail(email, 'saving', true));
    socket.emit('UPDATE_COMPILATION_EMAIL', {
      compilationId,
      emailId: email._id,
      newData,
    });
  };
}

export function getCompilationEmailPdf(compilationId, email) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationEmail(email, 'fetchingPdf', true));
    socket.emit('GET_COMPILATION_EMAIL_PDF', { compilationId, emailId: email._id });
  };
}
