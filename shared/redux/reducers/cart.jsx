import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const fetching = (state = initialState.fetching, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART :
      return action.val;

    case ActionTypes.SET_PROPERTY_FOR_CART :
      const cartCopy = Object.assign({}, state);
      cartCopy[action.prop] = action.val;
      return cartCopy;


    default:
      return state;
  }
};

export default fetching;
