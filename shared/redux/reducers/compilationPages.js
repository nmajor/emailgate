import * as ActionTypes from '../constants';
import initialState from '../../initialState';
import _ from 'lodash';

const compilationPages = (state = initialState.compilationPages, action) => {
  switch (action.type) {
    case ActionTypes.SET_COMPILATION_PAGES : {
      return action.pages;
    }

    case ActionTypes.REMOVE_COMPILATION_PAGE : {
      const pageIndex = _.findIndex(state, { _id: action.page._id });
      if (pageIndex > -1) {
        return [
          ...state.slice(0, pageIndex),
          ...state.slice(pageIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.SET_PROPERTY_FOR_COMPILATION_PAGE : {
      const propPageIndex = _.findIndex(state, { _id: action.page._id });
      if (propPageIndex > -1) {
        const email = Object.assign({}, state[propPageIndex]);
        email[action.prop] = action.val;
        return [
          ...state.slice(0, propPageIndex),
          email,
          ...state.slice(propPageIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.UPDATE_PAGE_IN_COMPILATION_PAGES : {
      const updatedPageIndex = _.findIndex(state, { _id: action.page._id });
      if (updatedPageIndex > -1) {
        return [
          ...state.slice(0, updatedPageIndex),
          action.page,
          ...state.slice(updatedPageIndex + 1),
        ];
      }
      return state;
    }

    case ActionTypes.UPDATE_PAGE_PDFS : {
      return _.map(state, (page) => {
        const updatedPage = _.find(action.pages, ['_id', page._id]);
        if (updatedPage) {
          const pageCopy = Object.assign({}, page);
          pageCopy.pdf = updatedPage.pdf;
          return pageCopy;
        }
        return page;
      });
    }

    default: {
      return state;
    }
  }
};

export default compilationPages;
