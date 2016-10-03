import React from 'react';
import routes from '../admin/routes';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { configureStore } from '../admin/redux/configureStore';

import socket from './socket';
import * as Actions from '../admin/redux/actions';

let store; // eslint-disable-line import/no-mutable-exports

if (typeof window !== 'undefined') {
  store = configureStore(window.__INITIAL_STATE__);
}

// Pull in the styles for webpack
require('./assets/scss/style.scss'); // eslint-disable-line

const history = browserHistory;
const dest = document.getElementById('root');

render((
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
), dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.'); // eslint-disable-line
  }
}

socket.on('UPDATED_COMPILATION', (compilation) => {
  console.log('event UPDATED_COMPILATION');
  store.dispatch(Actions.updateCompilationInCompilations(compilation));
});

socket.on('COMPILATION_LOG_ENTRY', (data) => {
  console.log('event COMPILATION_LOG_ENTRY');
  store.dispatch(Actions.appendToCompilationLog(data.compilationId, data.entry));
});
