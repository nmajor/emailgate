import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const purchaseOrders = (state = initialState.purchaseOrders, action) => {
  switch (action.type) {
    case ActionTypes.SET_PURCHASE_ORDERS :
      return action.purchaseOrders;

    case ActionTypes.ADD_PURCHASE_ORDER :
      return [
        ...state,
        action.purchaseOrder,
      ];

    case ActionTypes.UPDATE_PURCHASE_ORDER_IN_PURCHASE_ORDERS : {
      const purchaseOrderIndex = _.findIndex(state, { _id: action.purchaseOrder._id });
      if (purchaseOrderIndex > -1) {
        return [
          ...state.slice(0, purchaseOrderIndex),
          action.purchaseOrder,
          ...state.slice(purchaseOrderIndex + 1),
        ];
      }
      return state;
    }

    default:
      return state;
  }
};

export default purchaseOrders;
