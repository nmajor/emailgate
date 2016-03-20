
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
