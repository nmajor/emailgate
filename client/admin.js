import React from 'react';
import routes from '../admin/routes';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { configureStore } from '../admin/redux/configureStore';

let store; // eslint-disable-line import/no-mutable-exports

if (typeof window !== 'undefined') {
  store = configureStore(window.__INITIAL_STATE__);
}

require('./events');

// Pull in the styles for webpack
require('./assets/scss/admin/admin.scss'); // eslint-disable-line

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
