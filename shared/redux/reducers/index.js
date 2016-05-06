import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
// import _ from 'lodash';

import user from './user';
import fetching from './fetching';
import allUsers from './allUsers';
import accounts from './accounts';
import accountPasswordMap from './accountPasswordMap';
import compilations from './compilations';
import allCompilations from './allCompilations';
import compilationEmails from './compilationEmails';
import compilationPages from './compilationPages';
import currentAccountId from './currentAccountId';
import filteredAccountEmails from './filteredAccountEmails';

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

const config = (state = initialState.config, action) => {
  switch (action.type) {
    case ActionTypes.SET_CONFIG :
      return action.config;

    default:
      return state;
  }
};

const compilationPdfLog = (state = initialState.compilationPdfLog, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_PDF_LOG :
      return action.val;

    case ActionTypes.ADD_ENTRY_TO_COMPILATION_PDF_LOG :
      return [action.entry, ...state];

    default:
      return state;
  }
};

const appReducer = combineReducers({
  config,
  fetching,
  user,
  allUsers,
  accounts,
  accountPasswordMap,
  compilations,
  allCompilations,
  compilationEmails,
  compilationEmailPageMap,
  compilationPages,
  compilationPdfLog,
  currentAccountId,
  filteredAccountEmails,
  currentFilteredEmailMid,
});

const rootReducer = (state = initialState, action) => {
  if (action.type === ActionTypes.RESET_STATE) {
    state = initialState; // eslint-disable-line no-param-reassign
  }
  return appReducer(state, action);
};

export default rootReducer;
