import * as ActionTypes from '../constants';

export function setFilteredAccountEmailsCount(count) {
  return {
    type: ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_COUNT,
    count,
  };
}

export function setFilteredAccountEmailsErrors(errors) {
  return {
    type: ActionTypes.SET_FILTERED_ACCOUNT_EMAILS_ERRORS,
    errors,
  };
}
