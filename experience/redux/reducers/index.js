import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import initialState from '../../initialState';

import compilation from './compilation';
import user from './user';
import postcard from './postcard';

const config = (state = initialState.config, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const appReducer = combineReducers({
  form: formReducer,
  compilation,
  postcard,
  user,
  config,
});

export default appReducer;
