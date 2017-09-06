import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import compilations from './compilations';
import users from './users';
import orders from './orders';
import purchaseOrders from './purchaseOrders';
import promoCodes from './promoCodes';
import user from './user';
import email from './email';
import page from './page';
import settings from './settings';

const appReducer = combineReducers({
  form: formReducer,
  compilations,
  users,
  orders,
  purchaseOrders,
  promoCodes,
  user,
  email,
  page,
  settings,
});

export default appReducer;
