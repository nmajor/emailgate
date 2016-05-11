import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const checkout = (state = initialState.checkout, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROPERTY_FOR_CHECKOUT :
      const checkoutCopy = Object.assign({}, state);
      checkoutCopy[action.prop] = action.val;
      return checkoutCopy;

    default:
      return state;
  }
};

export default checkout;
