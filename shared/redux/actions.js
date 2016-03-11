import * as ActionTypes from './constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
import socket from '../../client/socket';

// Account Actions
export function addAccount(account) {
  return {
    type: ActionTypes.ADD_ACCOUNT,
    account,
  };
}

export function updateAccountInAccounts(account) {
  console.log(account);
  return {
    type: ActionTypes.UPDATE_ACCOUNT_IN_ACCOUNTS,
    account,
  };
}

export function setAccounts(accounts) {
  return {
    type: ActionTypes.SET_ACCOUNTS,
    accounts,
  };
}

export function setSelectAccount(id) {
  return {
    type: ActionTypes.SET_SELECTED_ACCOUNT,
    id,
  };
}

export function getAccounts(cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/accounts`, fetchOptions)
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

      dispatch(setAccounts(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function getAccount(id, cookie) {
  return (dispatch) => {
    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/accounts/${id}`, fetchOptions)
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

      return dispatch(addAccount(res));
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function createAccount(accountProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/accounts`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(accountProps),
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

      dispatch(addAccount(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateAccount(id, accountProps, cb) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/accounts/${id}`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(accountProps),
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

      dispatch(updateAccountInAccounts(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function validateAccount(account) {
  return (dispatch) => {
    socket.emit('VALIDATE_ACCOUNT', account);
    dispatch(updateAccountInAccounts(Object.assign({}, account, { validating: true })));
  };
}

// User Actions
export function setUser(user) {
  return {
    type: ActionTypes.SET_USER,
    _id: user._id,
    email: user.email,
    name: user.name,
    errors: user.errors,
  };
}

export function setUserErrors(errors, reset = false) {
  return {
    type: ActionTypes.SET_USER_ERRORS,
    errors,
    reset,
  };
}

export function clearUser() {
  return {
    type: ActionTypes.CLEAR_USER,
  };
}

export function getUser() {
  console.log('getting user');
  return (dispatch) => {
    fetch(`${baseURL}/api/user`, {
      credentials: 'include',
    })
    .then((res) => {
      if (res.status === 401) {
        throw new Error('User not found');
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

export function logoutUser() {
  console.log('logout user');
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
    })
    .catch((err) => {
      console.log(err.message);
    });
  };
}

export function registerUser(userData) {
  return (dispatch) => {
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
    })
    .catch((err) => {
      dispatch(setUserErrors({ base: [err.message] }));
    });
  };
}

export function loginUser(userData) {
  return (dispatch) => {
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
        throw new Error('User not found');
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
      dispatch(setUserErrors({ base: [err.message] }));
    });
  };
}

// POST EXAMPLES
export function addPost(post) {
  return {
    type: ActionTypes.ADD_POST,
    name: post.name,
    title: post.title,
    content: post.content,
    slug: post.slug,
    cuid: post.cuid,
    _id: post._id,
  };
}

export function changeSelectedPost(slug) {
  return {
    type: ActionTypes.CHANGE_SELECTED_POST,
    slug,
  };
}

export function addPostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/addPost`, {
      method: 'post',
      body: JSON.stringify({
        post: {
          name: post.name,
          title: post.title,
          content: post.content,
        },
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json()).then(res => dispatch(addPost(res.post)));
  };
}

export function addSelectedPost(post) {
  return {
    type: ActionTypes.ADD_SELECTED_POST,
    post,
  };
}

export function getPostRequest(post) {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPost?slug=${post}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((response) => response.json()).then(res => dispatch(addSelectedPost(res.post)));
  };
}

export function deletePost(post) {
  return {
    type: ActionTypes.DELETE_POST,
    post,
  };
}

export function addPosts(posts) {
  return {
    type: ActionTypes.ADD_POSTS,
    posts,
  };
}

export function fetchPosts() {
  return (dispatch) => {
    return fetch(`${baseURL}/api/getPosts`).
      then((response) => response.json()).
      then((response) => dispatch(addPosts(response.posts)));
  };
}

export function deletePostRequest(post) {
  return (dispatch) => {
    fetch(`${baseURL}/api/deletePost`, {
      method: 'post',
      body: JSON.stringify({
        postId: post._id,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => dispatch(deletePost(post)));
  };
}
