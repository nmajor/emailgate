import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
import { reducer as formReducer } from 'redux-form';
// import _ from 'lodash';

import user from './user';
import fetching from './fetching';
import allUsers from './allUsers';
import accounts from './accounts';
import addresses from './addresses';
import accountPasswordMap from './accountPasswordMap';
import compilations from './compilations';
import allCompilations from './allCompilations';
import compilationEmails from './compilationEmails';
import compilationPages from './compilationPages';
import currentAccountId from './currentAccountId';
import filteredAccountEmails from './filteredAccountEmails';
import filteredAccountEmailsResults from './filteredAccountEmailsResults';
import cart from './cart';
import checkout from './checkout';
import orders from './orders';
import queueJobMap from './queueJobMap';

const currentFilteredEmailMid = (state = initialState.currentFilteredEmailMid, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID :
      return action.mid;

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

const appReducer = combineReducers({
  form: formReducer,
  config,
  fetching,
  user,
  allUsers,
  accounts,
  addresses,
  accountPasswordMap,
  compilations,
  allCompilations,
  compilationEmails,
  compilationPages,
  currentAccountId,
  filteredAccountEmails,
  filteredAccountEmailsResults,
  currentFilteredEmailMid,
  cart,
  checkout,
  orders,
  queueJobMap,
});

const rootReducer = (state = initialState, action) => {
  if (action.type === ActionTypes.RESET_STATE) {
    state = initialState; // eslint-disable-line no-param-reassign
  }
  return appReducer(state, action);
};

export default rootReducer;
