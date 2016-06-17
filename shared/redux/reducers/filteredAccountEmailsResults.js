import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const filteredAccountEmailsResults = (state = initialState.filteredAccountEmailsResults, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_COUNT :
      return Object.assign({}, state, { count: action.count });

    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_ERRORS :
      return Object.assign({}, state, { errors: action.errors });

    default:
      return state;
  }
};

export default filteredAccountEmailsResults;
