import * as ActionTypes from './constants';
import { combineReducers } from 'redux';
import initialState from '../initialState';

const selectedAccount = (state = initialState.selectedAccount, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ACCOUNT :
      return action.id;

    default:
      return state;
  }
};

const editingAccount = (state = initialState.editingAccount, action) => {
  switch (action.type) {
    case ActionTypes.SET_EDITING_ACCOUNT :
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
        {
          _id: action._id,
          email: action.email,
          password: action.password,
          host: action.host,
          port: action.port,
        },
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

export default combineReducers({ user, accounts, selectedAccount, editingAccount });
