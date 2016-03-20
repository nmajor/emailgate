import * as ActionTypes from '../constants';
import initialState from '../../initialState';
// import _ from 'lodash';

const compilationEmails = (state = initialState.compilationEmails, action) => {
  console.log('reduce emails');
  console.log(action.emails ? action.emails.length : 'undefined');
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_EMAILS :
      return action.emails;

    case ActionTypes.ADD_COMPILATION_EMAIL :
      return [
        ...state,
        action.email,
      ];

    default:
      return state;
  }
};

export default compilationEmails;
