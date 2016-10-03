import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case ActionTypes.SET_ORDERS :
      return action.orders;

    default:
      return state;
  }
};

export default orders;
