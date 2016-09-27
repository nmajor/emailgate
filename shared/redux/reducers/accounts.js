import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const accounts = (state = initialState.accounts, action) => {
  switch (action.type) {
    case ActionTypes.SET_ACCOUNTS :
      return action.accounts;

    case ActionTypes.ADD_ACCOUNT :
      return [
        ...state,
        action.account,
      ];

    case ActionTypes.UPDATE_ACCOUNT_IN_ACCOUNTS : {
      const accountIndex = _.findIndex(state, { _id: action.account._id });
      if (accountIndex > -1) {
        return [
          ...state.slice(0, accountIndex),
          action.account,
          ...state.slice(accountIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.REMOVE_ACCOUNT_FROM_ACCOUNTS : {
      const removeAccountIndex = _.findIndex(state, { _id: action.account._id });
      if (removeAccountIndex > -1) {
        return [
          ...state.slice(0, removeAccountIndex),
          ...state.slice(removeAccountIndex + 1),
        ];
      }
      return state;
    }

    default:
      return state;
  }
};

export default accounts;
