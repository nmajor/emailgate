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

export function setPropertyFilteredAccountEmailsResults(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_FILTERED_ACCOUNT_EMAILS_RESULTS,
    prop,
    val,
  };
}
