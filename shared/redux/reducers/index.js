import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
import _ from 'lodash';

import * as fetchings from './fetchings';

import user from './user';
import accounts from './accounts';
import compilations from './compilations';
import selectedAccountId from './selectedAccountId';
import filteredAccountEmails from './filteredAccountEmails';
import filteredAccountEmailsCount from './filteredAccountEmailsCount';

const previewEmailMid = (state = initialState.previewEmailMid, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREVIEW_EMAIL_HASH_ID :
      return action.mid;

    default:
      return state;
  }
};

const selectedEmails = (state = initialState.selectedEmails, action) => {
  switch (action.type) {
    case ActionTypes.ADD_EMAIL_TO_SELECTED_EMAILS :
      return [...state, action.email];

    case ActionTypes.REMOVE_EMAIL_FROM_SELECTED_EMAILS :
      const accountIndex = _.findIndex(state, { mid: action.email.mid });
      if (accountIndex > -1) {
        return [
          ...state.slice(0, accountIndex),
          ...state.slice(accountIndex + 1),
        ];
      }
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  fetchingFilteredAccountEmailsCount: fetchings.fetchingFilteredAccountEmailsCount,
  fetchingFilteredAccountEmails: fetchings.fetchingFilteredAccountEmails,
  user,
  accounts,
  compilations,
  selectedAccountId,
  filteredAccountEmails,
  filteredAccountEmailsCount,
  previewEmailMid,
  selectedEmails,
});
