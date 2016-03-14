import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER :
      return {
        _id: action._id,
        email: action.email,
        name: action.name,
      };

    case ActionTypes.SET_USER_ERRORS :
      if (action.clear) {
        return { errors: action.errors };
      }

      return Object.assign({}, state, {
        errors: action.errors,
      });

    case ActionTypes.CLEAR_USER :
      return {};

    default:
      return state;
  }
};

export default user;
