import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const promoCodes = (state = initialState.promoCodes, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROMO_CODES : {
      return action.promoCodes;
    }

    case ActionTypes.ADD_PROMO_CODE : {
      return [
        ...state,
        action.promoCode,
      ];
    }

    case ActionTypes.REMOVE_PROMO_CODE : {
      const removePromoIndex = _.findIndex(state, { _id: action.promoCode._id });
      if (removePromoIndex > -1) {
        return [
          ...state.slice(0, removePromoIndex),
          ...state.slice(removePromoIndex + 1),
        ];
      }
      return state;
    }

    default:
      return state;
  }
};

export default promoCodes;
