import * as ActionTypes from '../constants';
import initialState from '../../initialState';
// import _ from 'lodash';

const postcard = (state = initialState.postcard, action) => {
  switch (action.type) {
    case ActionTypes.SET_POSTCARD :
      return { ...action.postcard };

    case ActionTypes.SET_POSTCARD_PROPS :
      return { ...state, ...action.props };

    default:
      return state;
  }
};

export default postcard;
