import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Page from '../models/page';
import { emailPdf, pagePdf, compilationPdf } from '../util/pdf';
import ss from 'socket.io-stream';
// import fs from 'fs';
ss.forceBase64 = true;

import _ from 'lodash';

import { imapifyFilter, processEmails } from '../util/helpers';

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
        socket.emit('UPDATED_ACCOUNT', account);
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
        socket.emit('UPDATED_ACCOUNT', account);
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
            socket.emit('ADDED_COMPILATION_EMAIL', email);
          });
        });
      });
    });

    socket.on('REMOVE_COMPILATION_EMAIL', (data) => {
      console.log('REMOVE_COMPILATION_EMAIL');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.findOneAndRemove({ _compilation: compilation._id, _id: data.emailId }))
      .then((email) => {
        socket.emit('REMOVED_COMPILATION_EMAIL', email);
      });
    });

    socket.on('UPDATE_COMPILATION_EMAIL', (data) => {
      console.log('UPDATE_COMPILATION_EMAIL');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.findOne({ _compilation: compilation._id, _id: data.emailId }))
      .then((email) => {
        email.subject = data.newData.subject; // eslint-disable-line no-param-reassign
        email.body = data.newData.body; // eslint-disable-line no-param-reassign
        return email.save();
      })
      .then((email) => {
        socket.emit('UPDATED_COMPILATION_EMAIL', email);
      });
    });

    socket.on('GET_COMPILATION_EMAIL_PDF', (data) => {
      console.log('GET_COMPILATION_EMAIL_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.findOne({ _compilation: compilation._id, _id: data.emailId }))
      .then((email) => {
        emailPdf(email)
        .then((pdfStream) => {
          const resStream = ss.createStream();
          ss(socket).emit('COMPILATION_EMAIL_PDF_STREAM', resStream, { email: email.toJSON() });

          pdfStream.pipe(resStream);
        });
      });
    });

    socket.on('UPDATE_COMPILATION_PAGE', (data) => {
      console.log('UPDATE_COMPILATION_PAGE');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Page.findOne({ _compilation: compilation._id, _id: data.pageId }))
      .then((page) => {
        page.content = data.newData; // eslint-disable-line no-param-reassign
        return page.save();
      })
      .then((page) => {
        socket.emit('UPDATED_COMPILATION_PAGE', page);
      });
    });

    socket.on('GET_COMPILATION_PAGE_PDF', (data) => {
      console.log('GET_COMPILATION_PAGE_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Page.findOne({ _compilation: compilation._id, _id: data.pageId }))
      .then((page) => {
        pagePdf(page)
        .then((pdfStream) => {
          const resStream = ss.createStream();
          ss(socket).emit('COMPILATION_PAGE_PDF_STREAM', resStream, { page: page.toJSON() });

          pdfStream.pipe(resStream);
        });
      });
    });

    socket.on('GET_COMPILATION_PDF', (data) => {
      console.log('GET_COMPILATION_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilationPdf);
      // .then((pdfStream) => {
      //   const wstream = fs.createWriteStream('compilation.pdf');
      //   pdfStream.pipe(wstream);
      // });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
