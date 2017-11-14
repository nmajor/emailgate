import * as ActionTypes from '../constants';
import initialState from '../../initialState';
// import _ from 'lodash';

const compilations = (state = initialState.compilation, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION :
      return action.compilation;

    default:
      return state;
  }
};

export default compilations;
