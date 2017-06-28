import * as ActionTypes from '../constants';

export function setAddingFilteredEmailIds(val) {
  return {
    type: ActionTypes.SET_ADDING_FILTERED_EMAIL_IDS,
    val,
  };
}

export function addIdToAddingFilteredEmailIds(id) {
  return {
    type: ActionTypes.ADD_ID_TO_ADDING_FILTERED_EMAIL_IDS,
    id,
  };
}

export function addIdsToAddingFilteredEmailIds(ids) {
  return {
    type: ActionTypes.ADD_IDS_TO_ADDING_FILTERED_EMAIL_IDS,
    ids,
  };
}

export function removeIdFromAddingFilteredEmailIds(id) {
  return {
    type: ActionTypes.REMOVE_ID_FROM_ADDING_FILTERED_EMAIL_IDS,
    id,
  };
}
