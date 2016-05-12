import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const orders = (state = initialState.orders, action) => {
  switch (action.type) {
    case ActionTypes.SET_ORDERS :
      return action.orders;

    case ActionTypes.ADD_ORDER :
      return [
        ...state,
        action.order,
      ];

    case ActionTypes.UPDATE_ORDER_IN_ORDERS :
      const orderIndex = _.findIndex(state, { _id: action.order._id });
      if (orderIndex > -1) {
        return [
          ...state.slice(0, orderIndex),
          action.order,
          ...state.slice(orderIndex + 1),
        ];
      }
      return state;

    default:
      return state;
  }
};

export default orders;
