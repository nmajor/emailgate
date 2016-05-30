import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Page from '../models/page';
import Cart from '../models/cart';
// import { emailPdf, pagePdf } from '../util/pdf';
// import { uploadStream } from '../util/uploader';
// import * as Docker from '../util/docker';
import _ from 'lodash';
import ss from 'socket.io-stream';
ss.forceBase64 = true;

import { processEmails } from '../util/helpers';
import { watchJob, slimJob } from '../util/jobs';

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

    socket.on('BUILD_COMPILATION_PDF', (data) => {
      console.log('BUILD_COMPILATION_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return compilation.needsNewPdf()
        .then((result) => {
          if (result) {
            return compilation.findOrSchedulePdfJob()
            .then((job) => {
              socket.emit('QUEUE_JOB', slimJob(job));

              const unwatchJob = watchJob(job, (updatedJob) => {
                socket.emit('QUEUE_JOB', slimJob(updatedJob));
              });

              socket.on('disconnect', () => {
                unwatchJob();
              });

              job.on('complete', () => {
                Compilation.findOne({ _user: compilation._user, _id: compilation._id })
                .then((compilation) => { // eslint-disable-line no-shadow
                  unwatchJob();
                  socket.emit('UPDATED_COMPILATION', compilation);
                  socket.emit('QUEUE_JOB_COMPLETE', job);
                });
              });
            });
          }
        })
        .catch((err) => {
          console.log(err.stack);
        });
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

    socket.on('ADD_CART_ITEM', (data) => {
      console.log('ADD_ITEM_TO_CART');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Cart.findOrNew({ _user: user._id }))
      .then((cart) => {
        cart.addItem(data);
        return cart.save();
      }).
      then((cart) => {
        socket.emit('UPDATED_CART', cart);
      });
    });

    socket.on('REMOVE_CART_ITEM', (data) => {
      console.log('REMOVE_CART_ITEM');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Cart.findCurrent({ _user: user._id, _order: null }))
      .then((cart) => {
        const cartItemIndex = _.findIndex(cart.items, (cartItem) => { return cartItem._id === data.cartItemId; });
        if (cartItemIndex > -1) {
          cart.items[cartItemIndex].remove();
          return cart.save();
        }

        return Promise.resolve(cart);
      }).
      then((cart) => {
        socket.emit('UPDATED_CART', cart);
      })
      .catch((err) => {
        console.log(`An error happened yo. ${err}`);
      });
    });

    socket.on('UPDATE_CART_ITEM', (data) => {
      console.log('UPDATE_CART_ITEM');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Cart.findOne({ _user: user._id }))
      .then((cart) => {
        const cartItemIndex = _.findIndex(cart.items, (cartItem) => { return cartItem._id === data.cartItemId; });
        if (cartItemIndex > -1) {
          cart.items[cartItemIndex].quantity = data.newData.quantity; // eslint-disable-line no-param-reassign
          return cart.save();
        }

        return Promise.resolve(cart);
      }).
      then((cart) => {
        socket.emit('UPDATED_CART', cart);
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
