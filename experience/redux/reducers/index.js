import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilation from './compilation';
import user from './user';

const appReducer = combineReducers({
  form: formReducer,
  compilation,
  user,
});

export default appReducer;
