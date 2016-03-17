import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const selectedAccountId = (state = initialState.selectedAccountId, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_ACCOUNT_ID :
      return action.accountId;

    default:
      return state;
  }
};

export default selectedAccountId;
