import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilation from './compilation';
import user from './user';
import postcard from './postcard';

const appReducer = combineReducers({
  form: formReducer,
  compilation,
  postcard,
  user,
});

export default appReducer;
