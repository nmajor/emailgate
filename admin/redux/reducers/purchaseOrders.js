import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const purchaseOrders = (state = initialState.purchaseOrders, action) => {
  switch (action.type) {
    case ActionTypes.SET_PURCHASE_ORDERS :
      return action.purchaseOrders;

    case ActionTypes.ADD_PURCHASE_ORDER :
      return [
        ...state,
        action.purchaseOrder,
      ];

    default:
      return state;
  }
};

export default purchaseOrders;
