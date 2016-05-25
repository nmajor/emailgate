
import * as ActionTypes from '../constants';
import baseURL from '../../baseURL';

// import socket from '../../../client/socket';

export * from './userActions';
export * from './fetchingActions';
export * from './allUsersActions';
export * from './accountActions';
export * from './addressActions';
export * from './accountPasswordMapActions';
export * from './compilationActions';
export * from './allCompilationsActions';
export * from './compilationEmailsActions';
export * from './compilationPagesActions';
export * from './filteredAccountEmails';
export * from './cartActions';
export * from './checkoutActions';
export * from './orderActions';
export * from './queueJobMapActions';

export function setCurrentFilteredEmailMid(mid) {
  return {
    type: ActionTypes.SET_CURRENT_FILTERED_EMAIL_MID,
    mid,
  };
}

export function setConfig(config) {
  return {
    type: ActionTypes.SET_CONFIG,
    config,
  };
}

export function getConfig(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/config`, fetchOptions)
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

      dispatch(setConfig(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
