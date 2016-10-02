import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const compilations = (state = initialState.compilations, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATIONS :
      return action.compilations;

    default:
      return state;
  }
};

export default compilations;
