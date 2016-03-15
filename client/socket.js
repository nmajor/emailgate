import io from 'socket.io-client';
import * as Actions from '../shared/redux/actions';
import store from './store';
import baseURL from '../shared/baseURL';

let socket;

if (typeof window !== 'undefined') {
  const ss = require('socket.io-stream');
  socket = io(baseURL);

  socket.on('UPDATE_ACCOUNT', (data) => {
    store.dispatch(Actions.socketUpdateAccount(data));
  });

  socket.on('FILTERED_ACCOUNT_EMAILS_COUNT', (data) => {
    console.log('blah count FILTERED_ACCOUNT_EMAILS_COUNT');
    console.log(data);
  });

  // socket.on('FILTERED_ACCOUNT_EMAILS_STREAM', (data) => {
  //   console.log('blah stream FILTERED_ACCOUNT_EMAILS_STREAM');
  //   console.log(data);
  // });

  ss(socket).on('FILTERED_ACCOUNT_EMAILS_STREAM', (emailStream) => {
    emailStream.on('data', (chunk) => {
      const email = JSON.parse(chunk.toString('utf8'));
      console.log(email);
    });

    emailStream.on('end', () => {
      console.log('stream ended');
    });
  });
}

export default socket;
