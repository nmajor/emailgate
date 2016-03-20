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

const previewEmailMid = (state = initialState.previewEmailMid, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREVIEW_EMAIL_HASH_ID :
      return action.mid;

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
  previewEmailMid,
  // selectedEmails,
});
