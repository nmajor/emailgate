import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const selectedFilteredEmailIds = (state = initialState.selectedFilteredEmailIds, action) => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_FILTERED_EMAIL_IDS : {
      return action.val;
    }

    case ActionTypes.ADD_ID_TO_SELECTED_FILTERED_EMAIL_IDS : {
      return [
        ...state,
        action.id,
      ];
    }

    case ActionTypes.REMOVE_ID_FROM_SELECTED_FILTERED_EMAIL_IDS : {
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

export default selectedFilteredEmailIds;
