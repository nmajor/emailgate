import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';
import { reducer as formReducer } from 'redux-form';
// import _ from 'lodash';

import user from './user';
import fetching from './fetching';
import accounts from './accounts';
import addresses from './addresses';
import accountPasswordMap from './accountPasswordMap';
import compilations from './compilations';
import compilationEmails from './compilationEmails';
import compilationPages from './compilationPages';
import filteredAccountEmails from './filteredAccountEmails';
import filteredAccountEmailsResults from './filteredAccountEmailsResults';
import currentFilteredAccountEmail from './currentFilteredAccountEmail';
import selectedFilteredEmailIds from './selectedFilteredEmailIds';
import addingFilteredEmailIds from './addingFilteredEmailIds';
import cart from './cart';
import checkout from './checkout';
import orders from './orders';

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
  accounts,
  addresses,
  accountPasswordMap,
  compilations,
  compilationEmails,
  compilationPages,
  filteredAccountEmails,
  filteredAccountEmailsResults,
  currentFilteredAccountEmail,
  selectedFilteredEmailIds,
  addingFilteredEmailIds,
  currentFilteredEmailMid,
  cart,
  checkout,
  orders,
});

const rootReducer = (state = initialState, action) => {
  if (action.type === ActionTypes.RESET_STATE) {
    state = Object.assign({}, initialState, { config: state.config });
  }
  return appReducer(state, action);
};

export default rootReducer;
