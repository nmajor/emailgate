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

ss(socket).on('COMPILATION_EMAIL_PDF_STREAM', (pdfStream, data) => {
  console.log('event COMPILATION_EMAIL_PDF_STREAM');
  const email = data.email;

  const blobStream = require('blob-stream');
  const pdfBlobStream = pdfStream.pipe(blobStream());
  pdfBlobStream.on('finish', () => {
    const pdf = pdfBlobStream.toBlobURL('application/pdf');
    email.pdf = pdf;
    store.dispatch(Actions.updateEmailInCompilationEmails(email));
  });
});

socket.on('UPDATED_COMPILATION_PAGE', (page) => {
  console.log('event UPDATED_COMPILATION_PAGE');
  store.dispatch(Actions.updatePageInCompilationPages(page));
});
