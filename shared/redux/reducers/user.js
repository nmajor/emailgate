import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const user = (state = initialState.user, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_APP_STATE :
      return { ...state, appState: { ...state.appState, ...action.appState } };

    case ActionTypes.SET_USER :
      return {
        _id: action.user._id,
        name: action.user.name,
        email: action.user.email,
        isTmp: action.user.isTmp,
        isAdmin: action.user.isAdmin,
        appState: action.user.appState,
      };

    case ActionTypes.SET_USER_ERRORS :
      if (action.clear) {
        return { errors: action.errors };
      }

      return Object.assign({}, state, {
        errors: action.errors,
      });

    case ActionTypes.SET_PROPERTY_FOR_USER : {
      const userCopy = Object.assign({}, state);
      userCopy[action.prop] = action.val;
      return userCopy;
    }

    case ActionTypes.CLEAR_USER :
      return {};

    default:
      return state;
  }
};

export default user;
