import * as ActionTypes from '../constants';

export function setSelectedFilteredEmailIds(val) {
  return {
    type: ActionTypes.SET_SELECTED_FILTERED_EMAIL_IDS,
    val,
  };
}

export function addIdToSelectedFilteredEmailIds(id) {
  return {
    type: ActionTypes.ADD_ID_TO_SELECTED_FILTERED_EMAIL_IDS,
    id,
  };
}

export function removeIdFromSelectedFilteredEmailIds(id) {
  return {
    type: ActionTypes.REMOVE_ID_FROM_SELECTED_FILTERED_EMAIL_IDS,
    id,
  };
}

export function removeIdsFromSelectedFilteredEmailIds(ids) {
  return {
    type: ActionTypes.REMOVE_IDS_FROM_SELECTED_FILTERED_EMAIL_IDS,
    ids,
  };
}
