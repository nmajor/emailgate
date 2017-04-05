import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const currentFilteredAccountEmail = (state = initialState.currentFilteredAccountEmail, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_FILTERED_ACCOUNT_EMAIL :
      return action.payload;

    default:
      return state;
  }
};

export default currentFilteredAccountEmail;
