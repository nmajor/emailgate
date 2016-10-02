import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilations from './compilations';

const appReducer = combineReducers({
  form: formReducer,
  compilations,
});

export default appReducer;
