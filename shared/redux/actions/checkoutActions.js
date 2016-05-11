import * as ActionTypes from '../constants';

export function setPropertyForCheckout(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_CHECKOUT,
    prop,
    val,
  };
}
