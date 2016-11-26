import * as ActionTypes from '../constants';
import baseURL from '../../../shared/baseURL';

export function setEmail(email) {
  return {
    type: ActionTypes.SET_EMAIL,
    email,
  };
}

export function getEmail(emailId) {
  return (dispatch) => {
    fetch(`${baseURL}/api/admin/emails/${emailId}`, {
      credentials: 'include',
    })
    .then((res) => {
      if (res.status === 401) {
        throw new Error('Invalid username or password');
      } else if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      dispatch(setEmail(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
