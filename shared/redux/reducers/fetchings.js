import * as ActionTypes from '../constants';
import initialState from '../../initialState';

export function fetchingFilteredAccountEmailsCount(state = initialState.fetchingFilteredAccountEmailsCount, action) {
  switch (action.type) {
    case ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS_COUNT :
      return action.val;

    default:
      return state;
  }
}

export function fetchingFilteredAccountEmails(state = initialState.fetchingFilteredAccountEmails, action) {
  switch (action.type) {
    case ActionTypes.SET_FETCHING_FILTERED_ACCOUNT_EMAILS :
      return action.val;

    default:
      return state;
  }
}
