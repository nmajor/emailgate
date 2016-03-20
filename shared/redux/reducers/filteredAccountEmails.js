import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const filteredAccountEmails = (state = initialState.filteredAccountEmails, action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTERED_ACCOUNT_EMAILS :
      return action.emails;

    case ActionTypes.ADD_FILTERED_ACCOUNT_EMAIL :
      return [
        ...state,
        action.email,
      ];

    case ActionTypes.SET_SELECTED_FOR_FILTERED_ACCOUNT_EMAIL :
      const emailIndex = _.findIndex(state, { mid: action.email.mid });
      if (emailIndex > -1) {
        const email = state[emailIndex];
        email.selected = action.val;
        return [
          ...state.slice(0, emailIndex),
          email,
          ...state.slice(emailIndex + 1),
        ];
      }
      return state;

    case ActionTypes.SET_SELECTED_FOR_ALL_FILTERED_ACCOUNT_EMAILS :
      return _.map(state, (email) => {
        const newEmail = email;
        newEmail.selected = action.val;
        return newEmail;
      });

    default:
      return state;
  }
};

export default filteredAccountEmails;
