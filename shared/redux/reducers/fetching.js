import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const fetching = (state = initialState.fetching, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROPERTY_FOR_FETCHING : {
      const fetchingCopy = Object.assign({}, state);
      fetchingCopy[action.prop] = action.val;
      return fetchingCopy;
    }

    default:
      return state;
  }
};

export default fetching;
