import * as ActionTypes from '../constants';

export function setQueueJobMapItem(job) {
  return {
    type: ActionTypes.SET_QUEUE_JOB_MAP_ITEM,
    key: `${job.data.referenceModel}-${job.data.referenceId}`,
    val: job,
  };
}

export function removeQueueJobMapItem(job) {
  return {
    type: ActionTypes.REMOVE_QUEUE_JOB_MAP_ITEM,
    key: `${job.data.referenceModel}-${job.data.referenceId}`,
  };
}
