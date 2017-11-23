import * as ActionTypes from '../constants';
// import fetch from 'isomorphic-fetch';
// import baseURL from '../../../shared/baseURL';
// import socket from '../../../client/socket';
import { getImageUrl, resizeImage, rotateImage, cropImage, resizeToWidth } from '../../helpers';

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
      croppedImage: undefined,
      thumbnail: undefined,
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
      croppedImage: undefined,
      thumbnail: undefined,
    }));
  };
}

export function cropPostcardImage(postcard) {
  return (dispatch) => {
    const { imageCrop } = postcard;

    resizeImage(getImageUrl(postcard.image), imageCrop.scale)
    .then((resizedImageUrl) => {
      return rotateImage(resizedImageUrl, imageCrop);
    })
    .then((rotatedUrl) => {
      return cropImage(rotatedUrl, imageCrop);
    })
    .then((url) => {
      return resizeToWidth(url, 100)
      .then((thumbnailUrl) => {
        dispatch(setPostcardProps({
          croppedImage: {
            url,
            updatedAt: Date.now(),
          },
          thumbnail: {
            url: thumbnailUrl,
            updatedAt: Date.now(),
          },
        }));
      });
    });
  };
}
