import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const compilationEmails = (state = initialState.compilationEmails, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_EMAILS :
      return action.emails;

    case ActionTypes.ADD_COMPILATION_EMAIL :
      return [
        ...state,
        action.email,
      ];

    case ActionTypes.REMOVE_COMPILATION_EMAIL :
      const emailIndex = _.findIndex(state, { _id: action.email._id });
      if (emailIndex > -1) {
        return [
          ...state.slice(0, emailIndex),
          ...state.slice(emailIndex + 1),
        ];
      }
      return state;

    case ActionTypes.SET_PROPERTY_FOR_COMPILATION_EMAIL :
      const propEmailIndex = _.findIndex(state, { _id: action.email._id });
      if (propEmailIndex > -1) {
        const email = state[propEmailIndex];
        email[action.prop] = action.val;
        return [
          ...state.slice(0, propEmailIndex),
          email,
          ...state.slice(propEmailIndex + 1),
        ];
      }
      return state;

    case ActionTypes.UPDATE_EMAIL_IN_COMPILATION_EMAILS :
      const updatedEmailIndex = _.findIndex(state, { _id: action.email._id });
      if (updatedEmailIndex > -1) {
        return [
          ...state.slice(0, updatedEmailIndex),
          action.email,
          ...state.slice(updatedEmailIndex + 1),
        ];
      }
      return state;

    default:
      return state;
  }
};

export default compilationEmails;
