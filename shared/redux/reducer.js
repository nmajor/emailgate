import * as ActionTypes from './constants';
import { combineReducers } from 'redux';
import initialState from '../initialState';
import _ from 'lodash';

const selectedAccount = (state = initialState.selectedAccount, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ACCOUNT :
      return action.id;

    default:
      return state;
  }
};

const accounts = (state = initialState.accounts, action) => {
  switch (action.type) {
    case ActionTypes.SET_ACCOUNTS :
      return action.accounts;

    case ActionTypes.ADD_ACCOUNT :
      return [
        ...state,
        action.account,
      ];

    case ActionTypes.UPDATE_ACCOUNT_IN_ACCOUNTS :
      const accountIndex = _.findIndex(state, { _id: action._id });
      return [
        ...state.slice(0, accountIndex),
        action.account,
        ...state.slice(accountIndex + 1),
      ];

    default:
      return state;
  }
};

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER :
      return {
        _id: action._id,
        email: action.email,
        name: action.name,
      };

    case ActionTypes.SET_USER_ERRORS :
      if (action.clear) {
        return { errors: action.errors };
      }

      return Object.assign({}, state, {
        errors: action.errors,
      });

    case ActionTypes.CLEAR_USER :
      return {};

    default:
      return state;
  }
};

export default combineReducers({ user, accounts, selectedAccount });
