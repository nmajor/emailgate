import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
// import _ from 'lodash';

import * as fetchings from './fetchings';

import user from './user';
import accounts from './accounts';
import compilations from './compilations';
import compilationEmails from './compilationEmails';
import selectedAccountId from './selectedAccountId';
import filteredAccountEmails from './filteredAccountEmails';
import filteredAccountEmailsCount from './filteredAccountEmailsCount';

const currentFilteredEmailMid = (state = initialState.currentFilteredEmailMid, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID :
      return action.mid;

    default:
      return state;
  }
};

const selectedCompilationEmailId = (state = initialState.selectedCompilationEmailId, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_COMPILATION_EMAIL_ID :
      return action.id;

    default:
      return state;
  }
};

const editingSelectedCompilationEmail = (state = initialState.editingSelectedCompilationEmail, action) => {
  switch (action.type) {
    case ActionTypes.SET_EDITING_SELECTED_COMPILATION_EMAIL :
      return action.val;

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
  compilationEmails,
  selectedAccountId,
  filteredAccountEmails,
  filteredAccountEmailsCount,
  currentFilteredEmailMid,
  selectedCompilationEmailId,
  editingSelectedCompilationEmail,
});
