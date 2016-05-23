import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const workerTasks = (state = initialState.workerTasks, action) => {
  switch (action.type) {
    case ActionTypes.SET_WORKER_TASKS :
      return action.tasks;

    default:
      return state;
  }
};

export default workerTasks;
