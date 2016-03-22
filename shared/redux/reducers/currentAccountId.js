import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const currentAccountId = (state = initialState.currentAccountId, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_ACCOUNT_ID :
      return action.accountId;

    default:
      return state;
  }
};

export default currentAccountId;
