import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const addresses = (state = initialState.addresses, action) => {
  switch (action.type) {
    case ActionTypes.SET_ADDRESSES :
      return action.addresses;

    case ActionTypes.ADD_ADDRESS :
      return [
        ...state,
        action.address,
      ];

    case ActionTypes.UPDATE_ADDRESS_IN_ADDRESSES :
      const addressIndex = _.findIndex(state, { _id: action.address._id });
      if (addressIndex > -1) {
        return [
          ...state.slice(0, addressIndex),
          action.address,
          ...state.slice(addressIndex + 1),
        ];
      }
      return state;

    case ActionTypes.REMOVE_ADDRESS_FROM_ADDRESSES :
      const removeAddressIndex = _.findIndex(state, { _id: action.address._id });
      if (removeAddressIndex > -1) {
        return [
          ...state.slice(0, removeAddressIndex),
          ...state.slice(removeAddressIndex + 1),
        ];
      }
      return state;

    default:
      return state;
  }
};

export default addresses;
