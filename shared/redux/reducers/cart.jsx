import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const fetching = (state = initialState.fetching, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART :
      return action.val;

    default:
      return state;
  }
};

export default fetching;
