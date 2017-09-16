import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';
import { addIdsToAddingFilteredEmailIds } from './addingFilteredEmailIdsActions';

import {
  setPropertyForSomeFilteredAccountEmails,
  setPropertyForSomeFilteredAccountEmailsById,
  setPropertyForFilteredAccountEmail,
} from './filteredAccountEmailsActions';

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
    dispatch(setPropertyForFetching('compilationEmails', true));

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

      dispatch(setPropertyForFetching('compilationEmails', false));
      dispatch(setCompilationEmails(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('compilationEmails', false));
      console.log(err);
    });
  };
}

export function rotateImageAttachment(compilationId, emailId, attachmentContentId) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationEmail({ _id: emailId }, 'saving', true));

    const url = `${baseURL}/api/compilations/${compilationId}/emails/${emailId}/rotate-attachment`;

    return fetch(url, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify({ attachmentContentId }),
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

      dispatch(updateEmailInCompilationEmails(res));
    })
    .catch((err) => {
      dispatch(setPropertyForCompilationEmail({ _id: emailId }, 'saving', false));
      console.log(err);
    });
  };
}

export function addEmailsToCompilationEmailsById(compilationId, accountId, emailIds) {
  return (dispatch) => {
    const ReactGA = require('../../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Adding Compilation Emails',
      value: emailIds.length,
    });

    fbq('track', 'AddEmails'); // eslint-disable-line no-undef

    dispatch(addIdsToAddingFilteredEmailIds(emailIds));
    dispatch(setPropertyForSomeFilteredAccountEmailsById(emailIds, 'saving', true));
    socket.emit('ADD_COMPILATION_EMAILS_BY_ID', { compilationId, accountId, emailIds });
  };
}

export function addEmailsToCompilationEmails(compilationId, emails) {
  return (dispatch) => {
    const ReactGA = require('../../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Adding Compilation Emails',
      value: emails.length,
    });

    fbq('track', 'AddEmails'); // eslint-disable-line no-undef

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
    dispatch(updateEmailInCompilationEmails({ ...email, ...{ ...newData, saving: true } }));
    // dispatch(setPropertyForCompilationEmail(email, 'saving', true));
    socket.emit('UPDATE_COMPILATION_EMAIL', {
      compilationId,
      emailId: email._id,
      newData,
    });
  };
}

export function rebuildEmailPdf(id) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationEmail({ _id: id }, 'rebuilding', true));
    socket.emit('REBUILD_COMPILTION_EMAIL_PDF', {
      emailId: id,
    });
  };
}
