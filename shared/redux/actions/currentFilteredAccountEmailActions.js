import * as ActionTypes from '../constants';
import baseURL from '../../baseURL';

export function setCurrentFilteredAccountEmail(val) {
  return {
    type: ActionTypes.SET_CURRENT_FILTERED_ACCOUNT_EMAIL,
    payload: val,
  };
}

export function fetchCurrentFilteredAccountEmail(accountId, emailId) {
  return (dispatch) => {
    dispatch(setCurrentFilteredAccountEmail({ fetching: true, id: emailId }));

    return fetch(`${baseURL}/api/emails/full/${accountId}/${emailId}`, {
      credentials: 'include',
    })
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

      dispatch(setCurrentFilteredAccountEmail(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
