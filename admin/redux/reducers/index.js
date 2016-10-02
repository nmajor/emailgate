import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilations from './compilations';
import user from '../../../shared/redux/reducers/user';

const appReducer = combineReducers({
  form: formReducer,
  compilations,
  user,
});

export default appReducer;
