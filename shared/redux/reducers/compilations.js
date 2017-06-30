import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const compilations = (state = initialState.compilations, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATIONS :
      return action.compilations;

    case ActionTypes.ADD_COMPILATION :
      return [
        ...state,
        action.compilation,
      ];

    case ActionTypes.SET_PROPERTY_FOR_COMPILATION : {
      const propCompilationIndex = _.findIndex(state, { _id: action.compilationId });
      if (propCompilationIndex > -1) {
        const compilation = Object.assign({}, state[propCompilationIndex]);
        compilation[action.prop] = action.val;
        return [
          ...state.slice(0, propCompilationIndex),
          compilation,
          ...state.slice(propCompilationIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.UPDATE_COMPILATION_IN_COMPILATIONS : {
      const updatedCompilationIndex = _.findIndex(state, { _id: action.compilation._id });
      if (updatedCompilationIndex > -1) {
        return [
          ...state.slice(0, updatedCompilationIndex),
          action.compilation,
          ...state.slice(updatedCompilationIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.REMOVE_COMPILATION_FROM_COMPILATIONS : {
      const removeCompilationIndex = _.findIndex(state, { _id: action.compilationId });
      if (removeCompilationIndex > -1) {
        return [
          ...state.slice(0, removeCompilationIndex),
          ...state.slice(removeCompilationIndex + 1),
        ];
      }
      return state;
    }

    default:
      return state;
  }
};

export default compilations;
