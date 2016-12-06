import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const promoCodes = (state = initialState.promoCodes, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROMO_CODES :
      return action.promoCodes;

    default:
      return state;
  }
};

export default promoCodes;
