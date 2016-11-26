import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilations from './compilations';
import users from './users';
import orders from './orders';
import purchaseOrders from './purchaseOrders';
import user from './user';
import email from './email';
import page from './page';

const appReducer = combineReducers({
  form: formReducer,
  compilations,
  users,
  orders,
  purchaseOrders,
  user,
  email,
  page,
});

export default appReducer;
