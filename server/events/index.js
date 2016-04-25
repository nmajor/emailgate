import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Page from '../models/page';
import { emailPdf, pagePdf } from '../util/pdf';
// import { uploadStream } from '../util/uploader';
import * as Docker from '../util/docker';
// import _ from 'lodash';
import ss from 'socket.io-stream';
ss.forceBase64 = true;

import { processEmails, emailPageMap } from '../util/helpers';


// import Bluebird from 'bluebird';
// import _ from 'lodash';


export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('CHECK_IMAP_ACCOUNT_CONNECTION', (data) => {
      console.log('CHECK_IMAP_ACCOUNT_CONNECTION');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then(account => account.checkImapConnection(data.password))
      .then((account) => {
        socket.emit('UPDATED_ACCOUNT', account);
      });
    });

    // socket.on('GET_ACCOUNT_MAILBOXES', (data) => {
    //   console.log('GET_ACCOUNT_MAILBOXES');
    //
    //   User.findOne({ email: socket.request.session.passport.user })
    //   .then(user => Account.findOne({ _user: user._id, _id: data._id }))
    //   .then(account => account.checkConnection())
    //   .then(account => account.getMailboxes())
    //   .then(account => account.save())
    //   .then((account) => {
    //     socket.emit('UPDATED_ACCOUNT', account);
    //   });
    // });

    // socket.on('GET_FILTERED_ACCOUNT_EMAILS_COUNT', (data) => {
    //   console.log('GET_FILTERED_ACCOUNT_EMAILS_COUNT');
    //   const mailbox = data.filter.mailbox;
    //   const filter = imapifyFilter(data.filter);
    //
    //   User.findOne({ email: socket.request.session.passport.user })
    //   .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
    //   .then(account => account.filteredEmailsCount(mailbox, filter))
    //   .then((count) => {
    //     socket.emit('FILTERED_ACCOUNT_EMAILS_COUNT', count);
    //   });
    // });

    socket.on('GET_FILTERED_ACCOUNT_EMAILS', (data) => {
      console.log('GET_FILTERED_ACCOUNT_EMAILS');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then((account) => {
        const resStream = ss.createStream();
        ss(socket).emit('FILTERED_ACCOUNT_EMAILS_STREAM', resStream);

        account.filteredEmailsStream(data.filter, data.password)
        .pipe(processEmails())
        .pipe(resStream);
      });
    });

    socket.on('ADD_COMPILATION_EMAILS', (data) => {
      console.log('ADD_COMPILATION_EMAILS');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return Promise.all(data.emails.map((emailData) => {
          const newEmail = new Email(emailData);
          newEmail._compilation = compilation._id;
          return newEmail.save()
          .then((email) => {
            socket.emit('ADDED_COMPILATION_EMAIL', email);
            return Promise.resolve(email);
          })
          .catch((err) => {
            console.log(`Error happened when adding compilation email ${err}`);
          });
        }));
        // .then((emails) => {
        //   let p = Promise.resolve();
        //
        //   _.forEach(emails, (email) => {
        //     p = p.then(() => {
        //       return email.countPdfPages()
        //       .then((emailWithPages) => {
        //         return emailWithPages.save();
        //       })
        //       .then((savedEmail) => {
        //         socket.emit('UPDATED_COMPILATION_EMAIL', savedEmail);
        //       });
        //     });
        //   });
        // })
        // .then(() => {
        //   return emailPageMap(compilation._id);
        // })
        // .then((pageMap) => {
        //   socket.emit('UPDATED_COMPILATION_EMAIL_PAGE_MAP', pageMap);
        // });
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
        return Promise.resolve(email);
      });
    });

    socket.on('GET_COMPILATION_EMAIL_PDF', (data) => {
      console.log('GET_COMPILATION_EMAIL_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.findOne({ _compilation: compilation._id, _id: data.emailId }))
      .then((email) => {
        emailPageMap(email._compilation)
        .then((pageMap) => {
          const resStream = ss.createStream();
          ss(socket).emit('COMPILATION_EMAIL_PDF_STREAM', resStream, { email: email.toJSON() });
          emailPdf(email, pageMap[email._id]).pipe(resStream);
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
        const resStream = ss.createStream();
        ss(socket).emit('COMPILATION_PAGE_PDF_STREAM', resStream, { page: page.toJSON() });
        pagePdf(page).pipe(resStream);
      });
    });

    socket.on('BUILD_COMPILATION_PDF', (data) => {
      console.log('BUILD_COMPILATION_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return Docker.buildEmailPdfs(compilation, (entry) => {
          socket.emit('COMPILATION_PDF_LOG_ENTRY', { compilation, entry });
        });
      })
      .then((compilation) => {
        socket.emit('BUILD_COMPILATION_PDF_FINISHED', compilation);
      })
      .catch((err) => {
        console.log(err);
      });
    });

    socket.on('REMOVE_ACCOUNT', (data) => {
      console.log('REMOVE_ACCOUNT');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data._id }))
      .then((account) => {
        return account.remove();
      }).
      then((account) => {
        socket.emit('REMOVED_ACCOUNT', account);
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
