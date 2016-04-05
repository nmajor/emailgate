
import * as ActionTypes from '../constants';

// import socket from '../../../client/socket';

export * from './userActions';
export * from './accountActions';
export * from './compilationActions';
export * from './compilationEmailsActions';
export * from './compilationEmailPageMapActions';
export * from './compilationPagesActions';
export * from './filteredAccountEmails';
export * from './filteredAccountEmailsCount';

// TODO: Need to make this pull from the URL instead of state
export function setCurrentFilteredEmailMid(mid) {
  return {
    type: ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID,
    mid,
  };
}
