import socket from './socket';
import * as Actions from '../shared/redux/actions';
import store from './store';

const ss = require('socket.io-stream');
ss.forceBase64 = true;

socket.on('UPDATE_ACCOUNT', (data) => {
  console.log('event UPDATE_ACCOUNT');
  store.dispatch(Actions.socketUpdateAccount(data));
});

socket.on('FILTERED_ACCOUNT_EMAILS_COUNT', (count) => {
  console.log('event FILTERED_ACCOUNT_EMAILS_COUNT');
  store.dispatch(Actions.setFilteredAccountEmailsCount(count));
});

ss(socket).on('FILTERED_ACCOUNT_EMAILS_STREAM', (emailStream) => {
  console.log('event FILTERED_ACCOUNT_EMAILS_STREAM');
  store.dispatch(Actions.setFilteredAccountEmails([]));

  emailStream.on('data', (chunk) => {
    const email = JSON.parse(chunk.toString('utf8'));

    store.dispatch(Actions.addFilteredAccountEmail(email));
  });

  emailStream.on('end', () => {
    store.dispatch(Actions.setFetchingFilteredAccountEmails(false));
  });
});
