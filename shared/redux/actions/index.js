
import * as ActionTypes from '../constants';

// import socket from '../../../client/socket';

export * from './userActions';
export * from './accountActions';
export * from './compilationActions';
export * from './compilationEmailActions';
export * from './compilationPageActions';
export * from './filteredAccountEmails';
export * from './filteredAccountEmailsCount';

export function setCurrentFilteredEmailMid(mid) {
  return {
    type: ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID,
    mid,
  };
}
