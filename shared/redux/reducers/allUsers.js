import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const allUsers = (state = initialState.allUsers, action) => {
  switch (action.type) {
    case ActionTypes.SET_ALL_USERS :
      return action.users;

    default:
      return state;
  }
};

export default allUsers;
