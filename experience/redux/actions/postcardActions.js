import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
// import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';

export function setPostcard(postcard) {
  return {
    type: ActionTypes.SET_POSTCARD,
    postcard,
  };
}

export function setPostcardProps(props) {
  return {
    type: ActionTypes.SET_POSTCARD_PROPS,
    props,
  };
}
