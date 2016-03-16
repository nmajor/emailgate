import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';

import user from './user';
import accounts from './accounts';
import compilations from './compilations';

const selectedAccountId = (state = initialState.selectedAccountId, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ACCOUNT_ID :
      return action.accountId;

    default:
      return state;
  }
};

const filteredAccountEmails = (state = initialState.filteredAccountEmails, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS :
      return action.emails;

    case ActionTypes.ADD_FILTERED_ACCOUNT_EMAIL :
      return [
        ...state,
        action.email,
      ];

    default:
      return state;
  }
};

const filteredAccountEmailsCount = (state = initialState.filteredAccountEmailsCount, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_COUNT :
      return action.count;

    default:
      return state;
  }
};

const fetchingFilteredAccountEmailsCount = (state = initialState.fetchingFilteredAccountEmailsCount, action) => {
  switch (action.type) {
    case ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS_COUNT :
      return action.val;

    default:
      return state;
  }
};

const fetchingFilteredAccountEmails = (state = initialState.fetchingFilteredAccountEmails, action) => {
  switch (action.type) {
    case ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS :
      return action.val;

    default:
      return state;
  }
};

export default combineReducers({
  user,
  accounts,
  compilations,
  selectedAccountId,
  filteredAccountEmails,
  filteredAccountEmailsCount,
  fetchingFilteredAccountEmailsCount,
  fetchingFilteredAccountEmails,
});
