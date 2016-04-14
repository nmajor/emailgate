import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const accountPasswordMap = (state = initialState.accountPasswordMap, action) => {
  switch (action.type) {
    case ActionTypes.SET_PASSWORD_IN_ACCOUNT_PASSWORD_MAP :
      const newState = Object.assign({}, state);
      newState[action.account._id] = action.password;
      return newState;

    default:
      return state;
  }
};

export default accountPasswordMap;
