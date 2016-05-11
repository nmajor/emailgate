import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const addresses = (state = initialState.addresses, action) => {
  switch (action.type) {
    case ActionTypes.SET_ADDRESSES :
      return action.addresses;

    default:
      return state;
  }
};

export default addresses;
