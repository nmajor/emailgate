import * as ActionTypes from './constants';
import fetch from 'isomorphic-fetch';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
import socket from '../../client/socket';

// Account Actions
export function createAccount(accountProps) {
  console.log(accountProps);
  return () => {
    fetch(`${baseURL}/api/user`, {
      credentials: 'include',
    });
    socket.emit('CREATE_ACCOUNT', accountProps);
  };
  // return (dispatch) => {
  //   return fetch(`${baseURL}/api/register`, {
  //     method: 'post',
  //     body: JSON.stringify({
  //       name: userData.name,
  //       email: userData.email,
  //       password: userData.password,
  //     }),
  //     headers: new Headers({
  //       'Content-Type': 'application/json',
  //     }),
  //   })
  // }
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
        throw new Error('Bad response from server');
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
        throw new Error('Bad response from server when trying to logout.');
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
        throw new Error('Bad response from server');
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
        throw new Error('Bad response from server');
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
