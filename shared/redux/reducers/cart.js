import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const cart = (state = initialState.cart, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART :
      return action.val;

    case ActionTypes.SET_PROPERTY_FOR_CART :
      const cartCopy = Object.assign({}, state);
      cartCopy[action.prop] = action.val;
      return cartCopy;

    case ActionTypes.SET_PROPERTY_FOR_CART_ITEM :
      const cartItemIndex = _.findIndex(state.items, { _id: action.cartItemId });
      if (cartItemIndex > -1) {
        const cartItem = Object.assign({}, state.items[cartItemIndex]);
        cartItem[action.prop] = action.val;
        const newItems = [
          ...state.items.slice(0, cartItemIndex),
          cartItem,
          ...state.items.slice(cartItemIndex + 1),
        ];

        return Object.assign({}, state, { items: newItems });
      }
      return state;

    default:
      return state;
  }
};

export default cart;
