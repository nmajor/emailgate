import * as ActionTypes from '../constants';
import socket from '../../../client/socket';

export function setFetchingFilteredAccountEmails(val) {
  return {
    type: ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS,
    val,
  };
}

export function setFilteredAccountEmails(emails) {
  return {
    type: ActionTypes.SET_FILTERED_ACCOUNT_EMAILS,
    emails,
  };
}

export function addFilteredAccountEmail(email) {
  return {
    type: ActionTypes.ADD_FILTERED_ACCOUNT_EMAIL,
    email,
  };
}

export function getFilteredAccountEmails(account, filter) {
  return (dispatch) => {
    dispatch(setFetchingFilteredAccountEmails(true));
    socket.emit('GET_FILTERED_ACCOUNT_EMAILS', { account, filter });
  };
}
