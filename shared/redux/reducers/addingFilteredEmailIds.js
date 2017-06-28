import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const addingFilteredEmailIds = (state = initialState.addingFilteredEmailIds, action) => {
  switch (action.type) {
    case ActionTypes.SET_ADDING_FILTERED_EMAIL_IDS : {
      return action.val;
    }

    case ActionTypes.ADD_ID_TO_ADDING_FILTERED_EMAIL_IDS : {
      return [
        ...state,
        action.id,
      ];
    }

    case ActionTypes.ADD_IDS_TO_ADDING_FILTERED_EMAIL_IDS : {
      return [
        ...state,
        ...action.ids,
      ];
    }

    case ActionTypes.REMOVE_ID_FROM_ADDING_FILTERED_EMAIL_IDS : {
      const removeIdIndex = state.indexOf(action.id);
      if (removeIdIndex > -1) {
        return [
          ...state.slice(0, removeIdIndex),
          ...state.slice(removeIdIndex + 1),
        ];
      }
      return state;
    }

    default: {
      return state;
    }
  }
};

export default addingFilteredEmailIds;
