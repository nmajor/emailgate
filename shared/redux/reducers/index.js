import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
// import _ from 'lodash';

import * as fetchings from './fetchings';

import user from './user';
import allUsers from './allUsers';
import accounts from './accounts';
import compilations from './compilations';
import allCompilations from './allCompilations';
import compilationEmails from './compilationEmails';
import compilationPages from './compilationPages';
import currentAccountId from './currentAccountId';
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

const compilationEmailPageMap = (state = initialState.compilationEmailPageMap, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_EMAIL_PAGE_MAP :
      return action.pageMap;

    default:
      return state;
  }
};

const appReducer = combineReducers({
  fetchingFilteredAccountEmailsCount: fetchings.fetchingFilteredAccountEmailsCount,
  fetchingFilteredAccountEmails: fetchings.fetchingFilteredAccountEmails,
  user,
  allUsers,
  accounts,
  compilations,
  allCompilations,
  compilationEmails,
  compilationEmailPageMap,
  compilationPages,
  currentAccountId,
  filteredAccountEmails,
  filteredAccountEmailsCount,
  currentFilteredEmailMid,
});

const rootReducer = (state = initialState, action) => {
  if (action.type === ActionTypes.RESET_STATE) {
    state = initialState; // eslint-disable-line no-param-reassign
  }
  return appReducer(state, action);
};

export default rootReducer;
