import React from 'react';
import routes from '../shared/routes';
// import DevTools from '../shared/container/DevTools';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import store from './store';
import Modal from 'react-modal';
import ReactGA from '../shared/ga';
import socket from './socket';

require('./events');

// Pull in the styles for webpack
require('./assets/scss/style.scss'); // eslint-disable-line

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

function setGaUserId() {
  const state = store.getState();

  if (state.user._id) {
    ReactGA.set({ userId: state.user._id });
  }
}

function joinUserRoom() {
  const state = store.getState();

  if (state.user._id) {
    socket.emit('JOIN_USER_ROOM', { userId: state.user._id, userEmail: state.user.email });
  }
}

const history = browserHistory;
const dest = document.getElementById('root');

render((
  <Provider store={store}>
    <Router history={history} routes={routes} onUpdate={logPageView} />
  </Provider>
), dest);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.'); // eslint-disable-line
  }
}

// Set GA user and trigger initial page view
joinUserRoom();
setGaUserId();
logPageView();

Modal.setAppElement('#root');

// if (process.env.CLIENT) {
//   console.log('Rendered twice in when using development webpack');
//   render(
//     <Provider store={store} key="provider">
//       <div>
//         <Router history={history} routes={routes} />
//       </div>
//     </Provider>,
//     dest
//   );
// }
