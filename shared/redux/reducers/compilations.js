import * as ActionTypes from '../constants';
import initialState from '../../initialState';
// import _ from 'lodash';

const compilations = (state = initialState.compilations, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATIONS :
      return action.compilations;

    case ActionTypes.ADD_COMPILATION :
      return [
        ...state,
        action.compilation,
      ];

    default:
      return state;
  }
};

export default compilations;
