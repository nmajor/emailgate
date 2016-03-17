import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const filteredAccountEmailsCount = (state = initialState.filteredAccountEmailsCount, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_COUNT :
      return action.count;

    default:
      return state;
  }
};
export default filteredAccountEmailsCount;
