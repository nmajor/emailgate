import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import socket, { refreshSocket } from '../../../client/socket';

import baseURL from '../../baseURL';

// User Actions
export function setUser(user) {
  if (window && user._id) {
    const ReactGA = require('../../ga').default; // eslint-disable-line
    ReactGA.set({ userId: user._id });
    socket.emit('JOIN_USER_ROOM', { userId: user._id, userEmail: user.email });
  }

  return {
    type: ActionTypes.SET_USER,
    user,
  };
}

export function setUserErrors(errors, reset = false) {
  return {
    type: ActionTypes.SET_USER_ERRORS,
    errors,
    reset,
  };
}

export function setUserAppState(appState) {
  return {
    type: ActionTypes.SET_USER_APP_STATE,
    appState,
  };
}

export function setPropertyUser(prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_USER,
    prop,
    val,
  };
}

export function clearUser() {
  return {
    type: ActionTypes.RESET_STATE,
  };
}

export function getUser() {
  return (dispatch) => {
    fetch(`${baseURL}/api/user`, {
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
      dispatch(setUser(res));
    })
    .catch((err) => {
      console.log(err);
      dispatch(clearUser());
    });
  };
}

export function logoutUser(cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/logout`, {
      credentials: 'include',
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server when trying to logout ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      dispatch(clearUser());
      refreshSocket();
      cb();
    })
    .catch((err) => {
      console.log(err.message);
    });
  };
}

export function registerUser(userData, cb) {
  return (dispatch) => {
    dispatch(setPropertyUser('registering', true));

    return fetch(`${baseURL}/api/register`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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
      dispatch(setUser(res));
      refreshSocket();
      fbq('track', 'CompleteRegistration', { status: 'complete' }); // eslint-disable-line no-undef
      cb(res);
    })
    .catch((err) => {
      console.log(err);
      dispatch(setPropertyUser('registering', false));
      dispatch(setUserErrors({ base: [err.message] }));
    });
  };
}

export function registerTmpUser(cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/register/tmp`, {
      credentials: 'include',
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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
      refreshSocket(() => {
        dispatch(setUser(res));
        cb(res);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function loginUser(userData, cb) {
  return (dispatch) => {
    dispatch(setPropertyUser('loggingIn', true));

    return fetch(`${baseURL}/api/login`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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
      dispatch(setUser(res));
      refreshSocket();
      cb(res);
    })
    .catch((err) => {
      dispatch(setPropertyUser('loggingIn', false));
      dispatch(setUserErrors({ base: [err.message] }));
    });
  };
}

export function updatePassword(data, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/update-password`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      if (!res.errors) {
        dispatch(setUser(res));
      }

      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function forgotPassword(data, cb) {
  return () => {
    return fetch(`${baseURL}/api/forgot-password`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function resetPassword(data, cb) {
  return () => {
    return fetch(`${baseURL}/api/reset-password`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateUserAppState(data) {
  return (dispatch) => {
    dispatch(setUserAppState(data));

    return fetch(`${baseURL}/api/users/app-state`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((res) => {
      dispatch(setUserAppState(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
