import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';

import _ from 'lodash';

import { imapifyFilter, processEmails } from '../util/helpers';
// import { imapifyFilter } from '../util/helpers';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('CHECK_ACCOUNT_CONNECTION', (data) => {
      console.log('CHECK_ACCOUNT_CONNECTION');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data._id }))
      .then(account => account.checkConnection())
      .then(account => account.save())
      .then((account) => {
        socket.emit('UPDATE_ACCOUNT', account);
      });
    });

    socket.on('GET_ACCOUNT_MAILBOXES', (data) => {
      console.log('GET_ACCOUNT_MAILBOXES');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data._id }))
      .then(account => account.checkConnection())
      .then(account => account.getMailboxes())
      .then(account => account.save())
      .then((account) => {
        socket.emit('UPDATE_ACCOUNT', account);
      });
    });

    socket.on('GET_FILTERED_ACCOUNT_EMAILS_COUNT', (data) => {
      console.log('GET_FILTERED_ACCOUNT_EMAILS_COUNT');
      const mailbox = data.filter.mailbox;
      const filter = imapifyFilter(data.filter);

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then(account => account.filteredEmailsCount(mailbox, filter))
      .then((count) => {
        socket.emit('FILTERED_ACCOUNT_EMAILS_COUNT', count);
      });
    });

    socket.on('GET_FILTERED_ACCOUNT_EMAILS', (data) => {
      console.log('GET_FILTERED_ACCOUNT_EMAILS');
      const mailbox = data.filter.mailbox;
      const filter = imapifyFilter(data.filter);

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then((account) => {
        const ss = require('socket.io-stream');
        ss.forceBase64 = true;

        const resStream = ss.createStream();
        ss(socket).emit('FILTERED_ACCOUNT_EMAILS_STREAM', resStream);

        account.filteredEmailsStream(mailbox, filter)
        .pipe(processEmails())
        .pipe(resStream);
      });
    });

    socket.on('ADD_COMPILATION_EMAILS', (data) => {
      console.log('ADD_COMPILATION_EMAILS');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        _.forEach(data.emails, (emailData) => {
          const newEmail = new Email(emailData);
          newEmail._compilation = compilation._id;
          newEmail.save()
          .then((email) => {
            socket.emit('COMPILATION_EMAIL', email);
          });
        });
      });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
