import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const filteredAccountEmails = (state = initialState.filteredAccountEmails, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS :
      return action.emails;

    case ActionTypes.ADD_FILTERED_ACCOUNT_EMAIL :
      return [
        ...state,
        action.email,
      ];

    default:
      return state;
  }
};

export default filteredAccountEmails;
