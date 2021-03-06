import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Order from '../models/order';
import Page from '../models/page';
import Cart from '../models/cart';
import _ from 'lodash';
import ss from 'socket.io-stream';
ss.forceBase64 = true;

import { processEmailStream } from '../util/helpers';
import { isPageEditable } from '../../shared/helpers';

function userIsAdmin(user) {
  const admins = [
    'nick@nmajor.com',
    'king.benjamin012@gmail.com',
  ];

  if (user.isAdmin || admins.indexOf(user.email) > -1) {
    return Promise.resolve(true);
  }

  return Promise.reject('User is not an admin');
}

function userIsAdminSafe(user) {
  return new Promise((resolve) => {
    return userIsAdmin(user)
    .then((isAdmin) => { resolve(isAdmin); })
    .catch(() => { resolve(false); });
  });
}

export default (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.join('everyone');

    socket.on('JOIN_USER_ROOM', (data) => {
      console.log('JOIN_USER_ROOM', data);
      if (_.get(socket, 'request.session.passport.user')) {
        User.findOne({ email: socket.request.session.passport.user })
        .then((user) => {
          if (_.isEqual(user._id, data.userId)) {
            socket.join(`users/${user._id}`);
          }
        });
      }
    });

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
        if (data.newData.title) { compilation.title = data.newData.title; } // eslint-disable-line no-param-reassign
        if (data.newData.subtitle) { compilation.subtitle = data.newData.subtitle; } // eslint-disable-line no-param-reassign
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
        console.log('An error happened while filtering account emails', err, err.stack);
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
        .pipe(processEmailStream())
        .pipe(resStream);
      });
    });

    socket.on('ADD_COMPILATION_EMAILS_BY_ID', (data) => {
      console.log('ADD_COMPILATION_EMAILS_BY_ID');
      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return Promise.all([
          Account.findOne({ _user: user._id, _id: data.accountId }),
          userIsAdminSafe(user)
          .then((isAdmin) => {
            if (isAdmin) {
              return Compilation.findOne({ _id: data.compilationId });
            }
            return Compilation.findOne({ _user: user._id, _id: data.compilationId });
          }),
        ]);
      })
      .then((results) => {
        const [account, compilation] = results;

        return account.getEmailsById(data.emailIds)
        .then((emails) => {
          let tasks = Promise.resolve();

          _.forEach(emails, (emailData) => {
            tasks = tasks.then(() => {
              const newEmail = new Email(emailData);
              newEmail._account = account._id;
              newEmail._compilation = compilation._id;
              return newEmail.save()
              .then((email) => {
                socket.emit('ADDED_COMPILATION_EMAIL', email.toObject());
                return Promise.resolve(email);
              })
              .catch((err) => {
                console.log(`Error happened when adding compilation email ${err}`);
              });
            });
          });

          return tasks;
        })
        .then(() => {
          return compilation.updateEmails();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
        })
        .catch((err) => {
          console.log('An error happened when trying to add an email by id', err, err.stack);
        });
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
        }))
        .then(() => {
          return compilation.updateEmails();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
        });
      });
    });

    socket.on('REMOVE_COMPILATION_EMAIL', (data) => {
      console.log('REMOVE_COMPILATION_EMAIL');
      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return userIsAdminSafe(user)
        .then((isAdmin) => {
          if (isAdmin) {
            return Compilation.findOne({ _id: data.compilationId });
          }
          return Compilation.findOne({ _user: user._id, _id: data.compilationId });
        });
      })
      .then((compilation) => {
        return Email.findOne({ _compilation: compilation._id, _id: data.emailId })
        .then((email) => {
          if (email) {
            return email.remove()
            .then(() => {
              socket.emit('REMOVED_COMPILATION_EMAIL', email);
            });
          }
        })
        .then(() => {
          return compilation.updateEmails();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
        });
      })
      .catch((err) => { console.log('An error happened when removing compilation email', err, err.stack); });
    });

    socket.on('UPDATE_COMPILATION_EMAIL', (data) => {
      console.log('UPDATE_COMPILATION_EMAIL');
      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return userIsAdminSafe(user)
        .then((isAdmin) => {
          if (isAdmin) {
            return Compilation.findOne({ _id: data.compilationId });
          }
          return Compilation.findOne({ _user: user._id, _id: data.compilationId });
        })
        .then(compilation => Email.findOne({ _compilation: compilation._id, _id: data.emailId }))
        .then((email) => {
          if (data.newData.subject) { email.subject = data.newData.subject; } // eslint-disable-line no-param-reassign
          if (data.newData.body) {
            email.body = decodeURIComponent(data.newData.body);
          } // eslint-disable-line no-param-reassign
          if (data.newData.date) { email.date = data.newData.date; } // eslint-disable-line no-param-reassign
          if (data.newData.from) { email.from = data.newData.from; } // eslint-disable-line no-param-reassign
          if (data.newData.attachments) { email.attachments = data.newData.attachments; } // eslint-disable-line no-param-reassign
          return email.save();
        })
        .then((email) => {
          socket.emit('UPDATED_COMPILATION_EMAIL', email);

          return email.updatePdf();
        })
        .then((email) => {
          socket.emit('UPDATED_COMPILATION_EMAIL', email);

          return Promise.resolve(email);
        });
      })
      .catch((err) => { console.log('An error happened when updating a compilation email', err); });
    });

    socket.on('UPDATE_COMPILATION_PAGE', (data) => {
      console.log('UPDATE_COMPILATION_PAGE');
      User.findOne({ email: socket.request.session.passport.user })
      .then((user) => {
        return userIsAdminSafe(user)
        .then((isAdmin) => {
          if (isAdmin) {
            return Compilation.findOne({ _id: data.compilationId });
          }
          return Compilation.findOne({ _user: user._id, _id: data.compilationId });
        })
        .then(compilation => Page.findOne({ _compilation: compilation._id, _id: data.pageId }))
        .then((page) => {
          page.content = { ...(page.content || {}), ...data.newData }; // eslint-disable-line no-param-reassign
          return page.save();
        })
        .then((page) => {
          socket.emit('UPDATED_COMPILATION_PAGE', page);
        });
      })
      .catch((err) => { console.log('An error happend when updating compilation page', err, err.stack); });
    });

    socket.on('REMOVE_COMPILATION_PAGE', (data) => {
      console.log('REMOVE_COMPILATION_PAGE');
      User.findOne({ email: socket.request.session.passport.user })
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return Page.findOne({ _compilation: compilation._id, _id: data.pageId })
        .then((page) => {
          if (isPageEditable(page)) {
            return page.remove()
            .then(() => {
              socket.emit('REMOVED_COMPILATION_PAGE', page);
            });
          }

          return Promise.reject('Tried to edit an uneditable page');
        })
        .then(() => {
          return compilation.updatePagePositions();
        })
        .then(() => {
          return compilation.updatePages();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
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
      })
      .catch((err) => {
        console.log(`An error happened while adding cart item ${err}`);
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
        console.log(`An error happened while removing cart item ${err}`);
      });
    });

    socket.on('UPDATE_CART_ITEM', (data) => {
      console.log('UPDATE_CART_ITEM');
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

    socket.on('BUILD_COMPILATION_PDF', (data) => {
      console.log('BUILD_COMPILATION_PDF', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        return compilation.buildPdf((info) => {
          socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: info });
        });
      })
      .then(() => {
        return Compilation.findOne({ _id: data.compilationId });
      })
      .then(() => {
        // socket.emit('UPDATED_COMPILATION', compilation);
      })
      .catch((err) => {
        socket.emit('COMPILATION_LOG_ENTRY', { compilationId: data.compilationId, entry: err });
      });
    });

    socket.on('ADMIN_UPDATE_ORDER', (data) => {
      console.log('ADMIN_UPDATE_ORDER', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Order.findOne({ _id: data.orderId }))
      .then((order) => {
        if (order && data.props.shippingMethod) {
          console.log('blah hello data.props.shippingMethod', data.props.shippingMethod);
          return Order.update({ _id: data.orderId }, { $set: { shippingMethod: data.props.shippingMethod } });
        }
        return Promise.resolve();
      })
      .then(() => Order.findOne({ _id: data.orderId }))
      .then((order) => {
        socket.emit('UPDATED_ORDER', order);
      });
    });

    socket.on('BUILD_COMPILATION_EMAILS_PDFS_DOCKER', (data) => {
      console.log('BUILD_COMPILATION_EMAILS_PDFS_DOCKER', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        return compilation.buildEmailsPdfs((info) => {
          socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: info });
        });
      })
      .then(() => {
        return Compilation.findOne({ _id: data.compilationId });
      })
      .then(() => {
        // socket.emit('UPDATED_COMPILATION', compilation);
      })
      .catch((err) => {
        socket.emit('COMPILATION_LOG_ENTRY', { compilationId: data.compilationId, entry: err });
      });
    });

    socket.on('BUILD_COMPILATION_COVER_PDF', (data) => {
      console.log('BUILD_COMPILATION_COVER_PDF', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        return compilation.buildCoverPdf((info) => {
          socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: info });
        });
      })
      .then(() => {
        return Compilation.findOne({ _id: data.compilationId });
      })
      .then(() => {
        // socket.emit('UPDATED_COMPILATION', compilation);
      })
      .catch((err) => {
        socket.emit('COMPILATION_LOG_ENTRY', { compilationId: data.compilationId, entry: err });
      });
    });

    socket.on('REBUILD_COMPILTION_EMAIL_PDF', (data) => {
      console.log('REBUILD_COMPILTION_EMAIL_PDF', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Email.findOne({ _id: data.emailId }))
      .then((email) => email.save())
      .then((email) => {
        return email.updatePdf();
      })
      .then((email) => {
        socket.emit('UPDATED_COMPILATION_EMAIL', email);
      })
      .catch((err) => { console.log('An error happened when rebuilding an email pdf', err); });
    });

    socket.on('REBUILD_COMPILTION_EMAIL_PDF_DOCKER', (data) => {
      console.log('REBUILD_COMPILTION_EMAIL_PDF_DOCKER', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Email.findOne({ _id: data.emailId }))
      .then((email) => {
        return email.buildPdf((info) => {
          console.log(info.message);
        });
      })
      .then(() => Email.findOne({ _id: data.emailId }))
      .then((email) => {
        socket.emit('UPDATED_COMPILATION_EMAIL', email);
      })
      .catch((err) => { console.log('An error happened when rebuilding an email pdf', err); });
    });

    socket.on('REBUILD_COMPILTION_PAGE_PDF', (data) => {
      console.log('REBUILD_COMPILTION_PAGE_PDF', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Page.findOne({ _id: data.pageId }))
      .then((page) => {
        return page.buildPdf((info) => {
          console.log(info.message);
        });
      })
      .then(() => Page.findOne({ _id: data.pageId }))
      .then((page) => {
        socket.emit('UPDATED_COMPILATION_PAGE', page);
      })
      .catch((err) => { console.log('An error happened when rebuilding an email pdf', err); });
    });

    socket.on('REIMPORT_EMAIL_BODY', (data) => {
      console.log('REIMPORT_EMAIL_BODY', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Email.findOne({ _id: data.emailId }))
      .then((email) => {
        return Account.findOne({ _id: email._account || 'B1xQfKskz' })
        .then((account) => {
          return account.getEmailById(email.remote_id);
        })
        .then((freshEmail) => {
          email.body = freshEmail.body;
          email.reProcessImages = true;
          return email.save();
        })
        .then((savedEmail) => {
          socket.emit('UPDATED_COMPILATION_EMAIL', savedEmail);
        });
      })
      .catch((err) => { console.log('An error happened when rebuilding an email pdf', err); });
    });

    socket.on('RESAVE_ALL_COMPILATION_COMPONENTS', (data) => {
      console.log('RESAVE_ALL_COMPILATION_COMPONENTS', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: 'Resaving all compilation components' } });

        return Promise.all([
          Page.find({ _compilation: compilation._id }),
          Email.find({ _compilation: compilation._id }),
        ])
        .then((results) => {
          const [pages, emails] = results;
          const components = [...pages, ...emails];

          let tasks = Promise.resolve();

          _.forEach(components, (component, index) => {
            tasks = tasks.then(() => {
              return component.save();
            })
            .then(() => {
              socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: `Resaved ${index + 1} out of ${components.length}` } });
            });
          });

          return tasks;
        })
        .then(() => {
          socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: 'Resave complete!!' } });
        });
      })
      .catch((err) => { console.log('An error happened resaving all compilation components', err); });
    });

    socket.on('BUILD_COMPILATION_EMAILS_PDFS', (data) => {
      console.log('BUILD_COMPILATION_EMAILS_PDFS', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: 'Resaving all compilation components' } });

        return Promise.all([
          Page.find({ _compilation: compilation._id }),
          Email.find({ _compilation: compilation._id }),
        ])
        .then((results) => {
          const [pages, emails] = results;
          const components = [...pages, ...emails];

          let tasks = Promise.resolve();

          _.forEach(emails, (component, index) => {
            tasks = tasks.then(() => {
              return component.save();
            })
            .then((email) => {
              return email.updatePdf();
            })
            .then(() => {
              socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: `Resaved ${index + 1} out of ${components.length}` } });
            });
          });

          return tasks;
        })
        .then(() => {
          socket.emit('COMPILATION_LOG_ENTRY', { compilationId: compilation._id, entry: { type: 'status', message: 'Pdf builds complete' } });
        });
      })
      .catch((err) => { console.log('An error happened resaving all compilation components', err); });
    });

    socket.on('RUN_ADMIN_TASK', (data) => {
      console.log('RUN_ADMIN_TASK', data);

      // OLD Customer Split book id = SdLoWlGIO
      // NEW Customer Split book id = BqqS4Ue7V

      Compilation.findOne({ _id: 'SdLoWlGIO' })
      .then((compilation) => {
        return compilation.duplicate();
      });

      // Email.findOne({ _id: 'B1GyB2jkG' })
      // .populate('_account')
      // .then((email) => {
      //   return email.save();
      // })
      // .then(() => {
      //   console.log('RUN_ADMIN_TASK finished');
      // });

      // Email.findOne({ _id: 'r1rcLxicJM' })
      // .populate('_account')
      // .then((email) => {
      //   return email._account.getEmailById(email.remoteId)
      //   .then((emails) => {
      //     email.body = emails[0].body;
      //     return email.save();
      //   });
      // })
      // .then(() => {
      //   console.log('RUN_ADMIN_TASK finished');
      // });

      // User.findOne({ email: socket.request.session.passport.user })
      // .then(userIsAdmin)
      // .then(() => {
      //   Compilation.find({})
      //   .then((compilations) => {
      //     let tasks = Promise.resolve();
      //
      //     _.forEach(compilations, (compilation) => {
      //       tasks = tasks.then(() => {
      //         return compilation.buildThumbnail()
      //         .then((comp) => {
      //           return comp.save();
      //         });
      //       });
      //     });
      //
      //     return tasks;
      //   });
      // })
      // .then(() => {
      //   console.log('ADMIN TASK COMPLETE');
      // })
      // .catch((err) => { console.log('An error happened when running the admin task', err); });
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('error', () => {
      console.log('Socket error');
    });
  });
};
