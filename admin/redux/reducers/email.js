import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const email = (state = initialState.email, action) => {
  switch (action.type) {
    case ActionTypes.SET_EMAIL :
      return action.email;

    default:
      return state;
  }
};

export default email;
