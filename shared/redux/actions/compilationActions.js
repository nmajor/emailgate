import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';
import _ from 'lodash';
import { serializeQuery } from '../../helpers';

import { setPropertyForFetching } from './fetchingActions';
import { addCompilationEmail } from './compilationEmailsActions';
import { setCompilationPages } from './compilationPagesActions';

// ACTIONS
export function addCompilation(compilation) {
  return {
    type: ActionTypes.ADD_COMPILATION,
    compilation,
  };
}

export function setCompilations(compilations) {
  return {
    type: ActionTypes.SET_COMPILATIONS,
    compilations,
  };
}

export function setPropertyForCompilation(compilationId, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_COMPILATION,
    compilationId,
    prop,
    val,
  };
}

export function setPropertiesForCompilation(compilationId, props) {
  return {
    type: ActionTypes.SET_PROPERTIES_FOR_COMPILATION,
    compilationId,
    props,
  };
}

export function updateCompilationInCompilations(compilation) {
  return {
    type: ActionTypes.UPDATE_COMPILATION_IN_COMPILATIONS,
    compilation,
  };
}

export function removeCompilationFromCompilations(compilationId) {
  return {
    type: ActionTypes.REMOVE_COMPILATION_FROM_COMPILATIONS,
    compilationId,
  };
}

// THUNKS
export function createCompilation(props, cb) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('newCompilation', true));

    return fetch(`${baseURL}/api/compilations`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify(props),
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

      dispatch(setPropertyForFetching('newCompilation', false));
      dispatch(addCompilation(res));

      const ReactGA = require('../../ga').default; // eslint-disable-line
      ReactGA.event({
        category: 'Compilation',
        action: 'Created a Compilation',
      });

      fbq('track', 'Lead', { // eslint-disable-line no-undef
        content_name: 'compilation',
      });

      cb(res);
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('newCompilation', false));
      console.log(err);
    });
  };
}

export function updateCompilationFetch(compilationId, props, cb) {
  return (dispatch) => {
    dispatch(setPropertiesForCompilation(compilationId, { ...props, saving: true }));

    return fetch(`${baseURL}/api/compilations/${compilationId}`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify(props),
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

      dispatch(updateCompilationInCompilations(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function getCompilations(query, cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('compilations', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    let url = `${baseURL}/api/compilations`;
    if (!_.isEmpty(query)) { url = `${url}?${serializeQuery(query)}`; }

    return fetch(url, fetchOptions)
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

      dispatch(setPropertyForFetching('compilations', false));
      dispatch(setCompilations(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('compilations', false));
      console.log(err);
    });
  };
}

export function deleteCompilation(compilationId, cb) {
  cb = cb || function() {}; // eslint-disable-line

  return (dispatch) => {
    dispatch(setPropertyForCompilation(compilationId, 'saving', true));

    return fetch(`${baseURL}/api/compilations/${compilationId}`, {
      credentials: 'include',
      method: 'delete',
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

      dispatch(removeCompilationFromCompilations(res._id));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function updateCompilation(compilation, newData) {
  return (dispatch) => {
    dispatch(setPropertyForCompilation(compilation._id, 'saving', true));
    socket.emit('UPDATE_COMPILATION', {
      compilationId: compilation._id,
      newData,
    });
  };
}

export function addBlankEmail(compilationId, cb) {
  return (dispatch) => {
    dispatch(setPropertyForCompilation(compilationId, 'saving', true));

    return fetch(`${baseURL}/api/compilations/${compilationId}/add-blank`, {
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

      dispatch(addCompilationEmail(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

export function addCustomPage(compilationId, props, cb) {
  return (dispatch) => {
    dispatch(setPropertyForCompilation(compilationId, 'saving', true));

    return fetch(`${baseURL}/api/compilations/${compilationId}/add-custom-page`, {
      credentials: 'include',
      method: 'post',
      body: JSON.stringify({ type: props.type, afterType: props.afterType, afterId: props.afterId }),
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

      dispatch(setCompilationPages(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}

// export function addWebpageImage(compilationId, props, cb) {
//   return (dispatch) => {
//     dispatch(setPropertyForCompilation(compilationId, 'saving', true));
//
//     return fetch(`${baseURL}/api/compilations/${compilationId}/add-webpage-image`, {
//       credentials: 'include',
//       method: 'post',
//       body: JSON.stringify({ imageData: props }),
//       headers: new Headers({
//         'Content-Type': 'application/json',
//       }),
//     })
//     .then((res) => {
//       if (res.status >= 400) {
//         throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
//       }
//
//       return res.json();
//     })
//     .then((res) => {
//       if (res.error) {
//         throw new Error(res.error.message);
//       }
//
//       dispatch(setCompilationPages(res));
//       cb(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   };
// }

// export function addCompilationImage(compilationId, image, cb) {
//   return (dispatch) => {
//     dispatch(setPropertyForCompilation(compilationId, 'addingImage', true));
//
//     return fetch(`${baseURL}/api/compilations/${compilationId}/add-image`, {
//       credentials: 'include',
//       method: 'post',
//       headers: new Headers({
//         'Content-Type': 'application/json',
//       }),
//     })
//     .then((res) => {
//       if (res.status >= 400) {
//         throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
//       }
//
//       return res.json();
//     })
//     .then((res) => {
//       if (res.error) {
//         throw new Error(res.error.message);
//       }
//
//       dispatch(addCompilationEmail(res));
//       cb(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   };
// }
