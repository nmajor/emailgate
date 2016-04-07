import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const allCompilations = (state = initialState.allCompilations, action) => {
  switch (action.type) {
    case ActionTypes.SET_ALL_COMPILATIONS :
      return action.compilations;

    default:
      return state;
  }
};

export default allCompilations;
