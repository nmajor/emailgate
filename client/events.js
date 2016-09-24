import socket from './socket';
import * as Actions from '../shared/redux/actions';
import store from './store';

const ss = require('socket.io-stream');
ss.forceBase64 = true;

socket.on('UPDATED_ACCOUNT', (data) => {
  console.log('event UPDATED_ACCOUNT');
  store.dispatch(Actions.socketUpdateAccount(data));
});

socket.on('FILTERED_ACCOUNT_EMAILS_COUNT', (count) => {
  console.log('event FILTERED_ACCOUNT_EMAILS_COUNT');
  store.dispatch(Actions.setFilteredAccountEmailsCount(count));
});

socket.on('FILTERED_ACCOUNT_EMAILS_ERROR', (errs) => {
  console.log('event FILTERED_ACCOUNT_EMAILS_ERRORS');
  store.dispatch(Actions.setFilteredAccountEmailsErrors(errs));
});

socket.on('FILTERED_ACCOUNT_EMAILS', (data) => {
  console.log('event FILTERED_ACCOUNT_EMAILS');
  store.dispatch(Actions.setFilteredAccountEmailsCount(data.count));
  store.dispatch(Actions.setFilteredAccountEmails(data.messages));
  store.dispatch(Actions.setPropertyFilteredAccountEmailsResults('nextPageToken', data.nextPageToken));
  store.dispatch(Actions.setPropertyForFetching('filteredAccountEmails', false));
});

ss(socket).on('FILTERED_ACCOUNT_EMAILS_STREAM', (emailStream) => {
  console.log('event FILTERED_ACCOUNT_EMAILS_STREAM');
  store.dispatch(Actions.setFilteredAccountEmails([]));

  emailStream.on('data', (chunk) => {
    const email = JSON.parse(chunk.toString('utf8'));

    store.dispatch(Actions.addFilteredAccountEmail(email));
  });

  emailStream.on('end', () => {
    store.dispatch(Actions.setPropertyForFetching('filteredAccountEmails', false));
  });
});

socket.on('ADDED_COMPILATION_EMAIL', (email) => {
  console.log('ADDED_COMPILATION_EMAIL');

  store.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', false));
  store.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'saving', false));
  store.dispatch(Actions.addCompilationEmail(email));
});

socket.on('REMOVED_COMPILATION_EMAIL', (email) => {
  console.log('REMOVED_COMPILATION_EMAIL');

  store.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', false));
  store.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'saving', false));
  store.dispatch(Actions.removeCompilationEmail(email));
});

socket.on('UPDATED_COMPILATION_EMAIL', (email) => {
  console.log('event UPDATED_COMPILATION_EMAIL');
  store.dispatch(Actions.updateEmailInCompilationEmails(email));
});

socket.on('UPDATED_COMPILATION_PAGE', (page) => {
  console.log('event UPDATED_COMPILATION_PAGE');
  store.dispatch(Actions.updatePageInCompilationPages(page));
});

socket.on('UPDATED_COMPILATION', (compilation) => {
  console.log('event UPDATED_COMPILATION');
  store.dispatch(Actions.updateCompilationInCompilations(compilation));
});

socket.on('REMOVED_ACCOUNT', (account) => {
  console.log('event REMOVED_ACCOUNT');
  store.dispatch(Actions.removeAccountFromAccounts(account));
});

socket.on('UPDATED_CART', (cart) => {
  console.log('event UPDATED_CART');
  store.dispatch(Actions.setCart(cart));
});

socket.on('QUEUE_JOB', (job) => {
  console.log('event QUEUE_JOB');
  store.dispatch(Actions.setQueueJobMapItem(job));
});

socket.on('QUEUE_JOB_COMPLETE', (job) => {
  console.log('event QUEUE_JOB_COMPLETE');
  store.dispatch(Actions.removeQueueJobMapItem(job));
});

socket.on('REFRESHED_EMAIL_PDFS', (emails) => {
  console.log('event REFRESHED_EMAIL_PDFS');
  store.dispatch(Actions.updateEmailPdfs(emails));
});

socket.on('REFRESHED_PAGE_PDFS', (pages) => {
  console.log('event REFRESHED_PAGE_PDFS');
  store.dispatch(Actions.updatePagePdfs(pages));
});
