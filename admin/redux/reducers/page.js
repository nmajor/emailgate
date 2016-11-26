import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const page = (state = initialState.page, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGE :
      return action.page;

    default:
      return state;
  }
};

export default page;
