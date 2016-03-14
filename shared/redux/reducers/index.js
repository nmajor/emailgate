import * as ActionTypes from '../constants';
import { combineReducers } from 'redux';
import initialState from '../../initialState';

import user from './user';
import accounts from './accounts';
import compilations from './compilations';

const selectedAccount = (state = initialState.selectedAccount, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ACCOUNT :
      return action.accountId;

    default:
      return state;
  }
};

export default combineReducers({ user, accounts, compilations, selectedAccount });
