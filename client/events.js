import socket from './socket';
import * as Actions from '../shared/redux/actions';
import store from './store';

// const ss = require('socket.io-stream');

socket.on('UPDATE_ACCOUNT', (data) => {
  console.log('event UPDATE_ACCOUNT');
  store.dispatch(Actions.socketUpdateAccount(data));
});

socket.on('FILTERED_ACCOUNT_EMAILS_COUNT', (data) => {
  console.log('blah count FILTERED_ACCOUNT_EMAILS_COUNT');
  console.log(data);
});

socket.on('FILTERED_ACCOUNT_EMAILS_STREAM', (emailStream) => {
  console.log('blah stream FILTERED_ACCOUNT_EMAILS_STREAM');
  console.log(emailStream);

  emailStream.on('data', (chunk) => {
    const email = JSON.parse(chunk.toString('utf8'));
    console.log(email);
  });

  emailStream.on('end', () => {
    console.log('stream ended');
  });
});
