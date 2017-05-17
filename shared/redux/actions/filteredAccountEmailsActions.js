import * as ActionTypes from '../constants';
import socket from '../../../client/socket';
import { setPropertyForFetching } from './fetchingActions';
import { setFilteredAccountEmailsCount, setFilteredAccountEmailsErrors, setPropertyFilteredAccountEmailsResults } from './filteredAccountEmailsResultsActions';

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

export function getFilteredAccountEmailsStream(account, filter, password) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('filteredAccountEmails', true));
    dispatch(setFilteredAccountEmails([]));
    dispatch(setFilteredAccountEmailsCount(undefined));
    dispatch(setFilteredAccountEmailsErrors(undefined));
    socket.emit('GET_FILTERED_ACCOUNT_EMAILS_STREAM', { account, password, filter });
  };
}

export function getFilteredAccountEmails(account, filter, password) {
  return (dispatch) => {
    const ReactGA = require('../../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Searching Account Emails',
    });

    if (!filter.pageToken) {
      dispatch(setPropertyFilteredAccountEmailsResults('pageTokens', undefined));
    }
    dispatch(setPropertyForFetching('filteredAccountEmails', true));
    dispatch(setFilteredAccountEmails([]));
    dispatch(setFilteredAccountEmailsCount(undefined));
    dispatch(setFilteredAccountEmailsErrors(undefined));
    socket.emit('GET_FILTERED_ACCOUNT_EMAILS', { account, password, filter });
  };
}

export function setPropertyForFilteredAccountEmail(email, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_FILTERED_ACCOUNT_EMAIL,
    email,
    prop,
    val,
  };
}

export function setPropertyForAllFilteredAccountEmails(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_ALL_FILTERED_ACCOUNT_EMAILS,
    prop,
    val,
  };
}

export function setPropertyForSomeFilteredAccountEmails(emailMids, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_SOME_FILTERED_ACCOUNT_EMAILS,
    emailMids,
    prop,
    val,
  };
}

export function setPropertyForSomeFilteredAccountEmailsById(emailIds, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_SOME_FILTERED_ACCOUNT_EMAILS_BY_ID,
    emailIds,
    prop,
    val,
  };
}
