import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';

import baseURL from '../../baseURL';
// import socket from '../../../client/socket';

export function setWorkerTasks(tasks) {
  return {
    type: ActionTypes.SET_WORKER_TASKS,
    tasks,
  };
}

export function getWorkerTasks(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/admin/tasks`, fetchOptions)
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }

      dispatch(setWorkerTasks(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
