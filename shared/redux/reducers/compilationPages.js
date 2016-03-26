import * as ActionTypes from '../constants';
import initialState from '../../initialState';
// import _ from 'lodash';

const compilationPages = (state = initialState.compilationPages, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_PAGES :
      return action.pages;

    default:
      return state;
  }
};

export default compilationPages;
