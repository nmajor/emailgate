import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const purchaseOrders = (state = initialState.purchaseOrders, action) => {
  switch (action.type) {
    case ActionTypes.SET_PURCHASE_ORDERS :
      return action.purchaseOrders;

    default:
      return state;
  }
};

export default purchaseOrders;
