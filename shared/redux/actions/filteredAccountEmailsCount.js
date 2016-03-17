import * as ActionTypes from '../constants';
import socket from '../../../client/socket';

export function setFetchingFilteredAccountEmailsCount(val) {
  return {
    type: ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS_COUNT,
    val,
  };
}

export function setFilteredAccountEmailsCount(count) {
  return {
    type: ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_COUNT,
    count,
  };
}

export function getFilteredAccountEmailsCount(account, filter) {
  return (dispatch) => {
    socket.emit('GET_FILTERED_ACCOUNT_EMAILS_COUNT', { account, filter });
    dispatch(setFetchingFilteredAccountEmailsCount(true));
  };
}
