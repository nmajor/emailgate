import * as ActionTypes from '../constants';
import fetch from 'isomorphic-fetch';
import baseURL from '../../baseURL';
import socket from '../../../client/socket';

import { setPropertyForFetching } from './fetchingActions';

export function setCompilationPages(pages) {
  return {
    type: ActionTypes.SET_COMPILATION_PAGES,
    pages,
  };
}

export function updatePageInCompilationPages(page) {
  return {
    type: ActionTypes.UPDATE_PAGE_IN_COMPILATION_PAGES,
    page,
  };
}

export function updatePagePdfs(pages) {
  return {
    type: ActionTypes.UPDATE_PAGE_PDFS,
    pages,
  };
}

export function getCompilationPages(compilationId, cookie) {
  return (dispatch) => {
    dispatch(setPropertyForFetching('compilationPages', true));

    const fetchOptions = {};

    if (cookie) {
      fetchOptions.headers = { cookie };
    } else {
      fetchOptions.credentials = 'include';
    }

    return fetch(`${baseURL}/api/compilations/${compilationId}/pages`, fetchOptions)
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

      dispatch(setPropertyForFetching('compilationPages', false));
      dispatch(setCompilationPages(res));
    })
    .catch((err) => {
      dispatch(setPropertyForFetching('compilationPages', false));
      console.log(err);
    });
  };
}

export function setPropertyForCompilationPage(page, prop, val) {
  return {
    type: ActionTypes.SET_PROPERTY_FOR_COMPILATION_PAGE,
    page,
    prop,
    val,
  };
}

export function updateCompilationPage(compilationId, page, newData) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationPage(page, 'saving', true));
    socket.emit('UPDATE_COMPILATION_PAGE', {
      compilationId,
      pageId: page._id,
      newData,
    });
  };
}

export function getCompilationPagePdf(compilationId, page) {
  return () => {
    socket.emit('GET_COMPILATION_PAGE_PDF', { compilationId, pageId: page._id });
  };
}

export function refreshPagePdfs(compilationId, pageIds) {
  return () => {
    socket.emit('REFRESH_PAGE_PDFS', { compilationId, pageIds });
  };
}

export function updateCompilationPageFetch(compilationId, page, content, cb) {
  return (dispatch) => {
    dispatch(setPropertyForCompilationPage(page, 'saving', true));

    return fetch(`${baseURL}/api/compilations/${compilationId}/page`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify({ page, content }),
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

      dispatch(updatePageInCompilationPages(res));
      cb(res);
    })
    .catch((err) => {
      console.log(err);
    });
  };
}
