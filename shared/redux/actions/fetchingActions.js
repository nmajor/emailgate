import * as ActionTypes from '../constants';

export function setPropertyForFetching(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_FETCHING,
    prop,
    val,
  };
}
