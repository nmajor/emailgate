import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const users = (state = initialState.users, action) => {
  switch (action.type) {
    case ActionTypes.SET_USERS :
      return action.users;

    default:
      return state;
  }
};

export default users;
