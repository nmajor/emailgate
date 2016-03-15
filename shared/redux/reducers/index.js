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

export default combineReducers({ user, accounts, compilations, selectedAccountId });
