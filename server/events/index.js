import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Page from '../models/page';
import Cart from '../models/cart';
// import _ from 'lodash';
import ss from 'socket.io-stream';
ss.forceBase64 = true;

import { processEmails } from '../util/helpers';
import { watchJob, slimJob } from '../util/jobs';

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

    socket.on('UPDATE_COMPILATION', (data) => {
      console.log('UPDATE_COMPILATION');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        if (data.newData.approvedAt) { compilation.approvedAt = data.newData.approvedAt; } // eslint-disable-line no-param-reassign
        if (data.newData.name) { compilation.name = data.newData.name; } // eslint-disable-line no-param-reassign
        return compilation.save();
      })
      .then((compilation) => {
        socket.emit('UPDATED_COMPILATION', compilation);
        return Promise.resolve(compilation);
      });
    });

    socket.on('GET_FILTERED_ACCOUNT_EMAILS', (data) => {
      console.log('GET_FILTERED_ACCOUNT_EMAILS');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then((account) => {
        const options = {
          filter: data.filter,
          password: data.password,
        };

        return account.filteredEmails(options);
      })
      .then((results) => {
        socket.emit('FILTERED_ACCOUNT_EMAILS', results);
      })
      .catch((err) => {
        socket.emit('FILTERED_ACCOUNT_EMAILS_ERROR', err);
      });
    });

    socket.on('GET_FILTERED_ACCOUNT_EMAILS_STREAM', (data) => {
      console.log('GET_FILTERED_ACCOUNT_EMAILS_STREAM');

      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Account.findOne({ _user: user._id, _id: data.account._id }))
      .then((account) => {
        function countCb(count) {
          socket.emit('FILTERED_ACCOUNT_EMAILS_COUNT', count);
        }

        function errCb(errs) {
          socket.emit('FILTERED_ACCOUNT_EMAILS_ERROR', errs);
        }

        const options = {
          filter: data.filter,
          password: data.password,
          countCb,
          errCb,
        };

        const resStream = ss.createStream();
        ss(socket).emit('FILTERED_ACCOUNT_EMAILS_STREAM', resStream);

        if (socket.filteredEmailStream) { socket.filteredEmailStream.end(); }
        socket.filteredEmailStream = account.filteredEmailsStream(options); // eslint-disable-line no-param-reassign

        socket.filteredEmailStream
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

    socket.on('GET_COMPILATION_EMAIL_PDF', (data) => {
      console.log('GET_COMPILATION_EMAIL_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.findOne({ _compilation: compilation._id, _id: data.emailId }))
      .then((email) => {
        return email.needsNewPdf()
        .then((pdfNeeded) => {
          if (pdfNeeded) {
            return email.findOrSchedulePdfJob()
            .then((job) => {
              socket.emit('QUEUE_JOB', slimJob(job));

              const unwatchJob = watchJob(job, (updatedJob) => {
                socket.emit('QUEUE_JOB', slimJob(updatedJob));
              });

              socket.on('disconnect', () => {
                unwatchJob();
              });

              job.on('complete', () => {
                Email.findOne({ _id: email._id })
                .then((email) => { // eslint-disable-line no-shadow
                  socket.emit('UPDATED_COMPILATION_EMAIL', email);
                  socket.emit('QUEUE_JOB_COMPLETE', job);
                  return Promise.resolve(email);
                });
              });
            });
          }

          socket.emit('UPDATED_COMPILATION_EMAIL', email);
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
        return page.needsNewPdf()
        .then((pdfNeeded) => {
          if (pdfNeeded) {
            return page.findOrSchedulePdfJob()
            .then((job) => {
              socket.emit('QUEUE_JOB', slimJob(job));

              const unwatchJob = watchJob(job, (updatedJob) => {
                socket.emit('QUEUE_JOB', slimJob(updatedJob));
              });

              socket.on('disconnect', () => {
                unwatchJob();
              });

              job.on('complete', () => {
                Page.findOne({ _id: page._id })
                .then((page) => { // eslint-disable-line no-shadow
                  socket.emit('UPDATED_COMPILATION_PAGE', page);
                  socket.emit('QUEUE_JOB_COMPLETE', job);
                  return Promise.resolve(page);
                });
              });
            });
          }

          socket.emit('UPDATED_COMPILATION_PAGE', page);
        });
      });
    });

    socket.on('GET_COMPILATION_PDF', (data) => {
      console.log('GET_COMPILATION_PDF');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return compilation.needsNewPdf()
        .then((pdfNeeded) => {
          if (pdfNeeded) {
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

          socket.emit('UPDATED_COMPILATION', compilation);
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
      })
      .then((cart) => {
        socket.emit('UPDATED_CART', cart);
      });
    });

    socket.on('REMOVE_CART_ITEM', (data) => {
      console.log('REMOVE_CART_ITEM');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Cart.findCurrent({ _user: user._id, _order: null }))
      .then((cart) => {
        cart.removeItem(data.cartItemId);
        return cart.save();
      })
      .then((cart) => {
        socket.emit('UPDATED_CART', cart);
      })
      .catch((err) => {
        console.log(`An error happened yo. ${err}`);
      });
    });

    socket.on('UPDATE_CART_ITEM', (data) => {
      console.log('UPDATE_CART_ITEM');
      console.log(data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Cart.findOne({ _user: user._id, _order: null }))
      .then((cart) => {
        cart.updateItem(data.cartItemId, data.newData);
        return cart.save();
      }).
      then((cart) => {
        socket.emit('UPDATED_CART', cart);
      });
    });

    socket.on('REFRESH_PAGE_PDFS', (data) => {
      console.log('REFRESH_PAGE_PDFS');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Page.find({ _compilation: compilation._id, _id: { $in: data.pageIds } }).select('pdf'))
      .then((pages) => {
        socket.emit('REFRESHED_PAGE_PDFS', pages);
      });
    });

    socket.on('REFRESH_EMAIL_PDFS', (data) => {
      console.log('REFRESH_EMAIL_PDFS');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then(compilation => Email.find({ _compilation: compilation._id, _id: { $in: data.emailIds } }).select('pdf'))
      .then((emails) => {
        socket.emit('REFRESHED_EMAIL_PDFS', emails);
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
