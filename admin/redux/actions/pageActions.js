import * as ActionTypes from '../constants';
import baseURL from '../../../shared/baseURL';

export function setPage(page) {
  return {
    type: ActionTypes.SET_PAGE,
    page,
  };
}

export function getPage(pageId) {
  return (dispatch) => {
    fetch(`${baseURL}/api/admin/pages/${pageId}`, {
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
      dispatch(setPage(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
