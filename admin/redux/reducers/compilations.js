import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const compilations = (state = initialState.compilations, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATIONS :
      return action.compilations;

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

    case ActionTypes.APPEND_TO_COMPILATION_LOG : {
      const loggedCompilationIndex = _.findIndex(state, { _id: action.compilationId });
      if (loggedCompilationIndex > -1) {
        const compilation = Object.assign({}, state[loggedCompilationIndex]);
        compilation.logs = compilation.logs || [];
        compilation.logs.push(action.entry);
        return [
          ...state.slice(0, loggedCompilationIndex),
          compilation,
          ...state.slice(loggedCompilationIndex + 1),
        ];
      }
      return state;
    }

    default:
      return state;
  }
};

export default compilations;
