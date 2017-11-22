import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
// import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';
import { getImageUrl, resizeImage } from '../../helpers';

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



export function updatePostcardImage(props) {
  return (dispatch) => {
    dispatch(setPostcardProps({
      image: { ...props,
        updatedAt: Date.now(),
      },
      imageCrop: undefined,
    }));
  };
}

export function updatePostcardImageCrop(props) {
  return (dispatch) => {
    dispatch(setPostcardProps({
      imageCrop: {
        ...props,
        updatedAt: Date.now(),
      },
    }));
  };
}

export function scalePostcardImage(postcard) {
  return (dispatch) => {
    resizeImage(getImageUrl(postcard.image), postcard.imageCrop.scale)
    .then((url) => {
      console.log('blah hey 1', url.substr(0, 100));
      dispatch(setPostcardProps({
        scaledImage: {
          url,
          updatedAt: Date.now(),
        },
      }));
    });
  };
}
