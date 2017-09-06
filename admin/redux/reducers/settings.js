import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const settings = (state = initialState.settings, action) => {
  switch (action.type) {
    case ActionTypes.SET_SETTINGS :
      return action.settings;

    default:
      return state;
  }
};

export default settings;
