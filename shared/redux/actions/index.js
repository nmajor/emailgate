
import * as ActionTypes from '../constants';

// import socket from '../../../client/socket';

export * from './userActions';
export * from './accountActions';
export * from './compilationActions';
export * from './filteredAccountEmails';
export * from './filteredAccountEmailsCount';

export function setPreviewEmailMid(mid) {
  return {
    type: ActionTypes.SET_PREVIEW_EMAIL_HASH_ID,
    mid,
  };
}

export function addEmailToSelectedEmails(email) {
  return {
    type: ActionTypes.ADD_EMAIL_TO_SELECTED_EMAILS,
    email,
  };
}

export function removeEmailFromSelectedEmails(email) {
  return {
    type: ActionTypes.REMOVE_EMAIL_FROM_SELECTED_EMAILS,
    email,
  };
}
