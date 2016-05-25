import * as ActionTypes from '../constants';
import initialState from '../../initialState';

const queueJobMap = (state = initialState.queueJobMap, action) => {
  switch (action.type) {
    case ActionTypes.SET_QUEUE_JOB_MAP_ITEM :
      const newQueueJobMap = Object.assign({}, state);
      newQueueJobMap[action.key] = action.val;
      return newQueueJobMap;

    default:
      return state;
  }
};

export default queueJobMap;
