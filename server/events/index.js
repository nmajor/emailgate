import Account from '../models/account';
import User from '../models/user';
import Compilation from '../models/compilation';
import Email from '../models/email';
import Page from '../models/page';
import Cart from '../models/cart';
// import _ from 'lodash';
import ss from 'socket.io-stream';
ss.forceBase64 = true;

import { processEmailStream } from '../util/helpers';

function userIsAdmin(user) {
  if (user.isAdmin || user.email === 'nick@nmajor.com') {
    return Promise.resolve(true);
  }

  return Promise.reject('User is not an admin');
}

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
          Compilation.findOne({ _user: user._id, _id: data.compilationId }),
        ]);
      })
      .then((results) => {
        const [account, compilation] = results;

        return account.getEmailsById(data.emailIds)
        .then((emails) => {
          return Promise.all(emails.map((emailData) => {
            const newEmail = new Email(emailData);
            newEmail._compilation = compilation._id;
            return newEmail.save()
            .then((email) => {
              socket.emit('ADDED_COMPILATION_EMAIL', email.toObject());
              return Promise.resolve(email);
            })
            .catch((err) => {
              console.log(`Error happened when adding compilation email ${err}`);
            });
          }));
        })
        .then(() => {
          return compilation.updateEmails();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
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
      .then(user => Compilation.findOne({ _user: user._id, _id: data.compilationId }))
      .then((compilation) => {
        return Email.findOneAndRemove({ _compilation: compilation._id, _id: data.emailId })
        .then((email) => {
          socket.emit('REMOVED_COMPILATION_EMAIL', email);
        })
        .then(() => {
          return compilation.updateEmails();
        })
        .then((compilation) => { // eslint-disable-line no-shadow
          socket.emit('UPDATED_COMPILATION', compilation);
        });
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
        email.date = data.newData.date; // eslint-disable-line no-param-reassign
        email.from = data.newData.from; // eslint-disable-line no-param-reassign
        email.attachments = data.newData.attachments; // eslint-disable-line no-param-reassign
        console.log('blah last', email.attachments[email.attachments.length - 1]);
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

    // socket.on('BUILD_COMPILATION_COVER_PDF', (data) => {
    // socket.on('BUILD_COMPILATION_COVER_PDF', () => {
    //   const request = require('request'); // eslint-disable-line
    //
    //   const headers = {
    //     'X-Requested-With': 'XMLHttpRequest',
    //     Referer: 'https://myaccount.lightningsource.com/Portal/Tools/SpineCalculator',
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //   };
    //
    //   const dataString = 'ISBN=9783161484100&BookTypeSelector%3ABookTypeID=4414&TrimSize=6.000%22+x+9.000%22+(229mm+x+152mm)&BookTypeSelector%3Aprop_111=Color&BookTypeSelector%3Aprop_112=Standard+Color+70&BookTypeSelector%3Aprop_113=Hardback&BookTypeSelector%3Aprop_91=Case+Laminate&BookTypeSelector%3Aprop_93=Matte&BookTypeID=4414&PageCount=389&X-Requested-With=XMLHttpRequest';
    //
    //   const options = {
    //     url: 'https://myaccount.lightningsource.com/Tools/SpineCalculator/Calculate',
    //     method: 'POST',
    //     headers,
    //     body: dataString,
    //   };
    //
    //   function callback(error, response, body) {
    //     console.log('blah hey error', error);
    //     console.log('blah hey error', body);
    //     console.log('blah hey error', response);
    //     if (!error && response.statusCode === 200) {
    //       console.log(body);
    //     }
    //   }
    //
    //   request(options, callback);


      // function requestLogger(httpModule) {
      //   const original = httpModule.request;
      //   httpModule.request = (options, callback) => { // eslint-disable-line
      //     return original(options, callback);
      //   };
      //   return httpModule;
      // }
      //
      // const https = requestLogger(require('https')); // eslint-disable-line
      //
      // const options = {
      //   hostname: 'myaccount.lightningsource.com',
      //   path: '/Tools/SpineCalculator/Calculate',
      //   method: 'POST',
      //   headers: {
      //     Referer: 'https://myaccount.lightningsource.com/Portal/Tools/SpineCalculator',
      //     Origin: 'https://myaccount.lightningsource.com',
      //   },
      // };
      //
      // const request = 'ISBN=9783161484100&BookTypeSelector%3ABookTypeID=4414&TrimSize=6.000%22+x+9.000%22+(229mm+x+152mm)&BookTypeSelector%3Aprop_111=Color&BookTypeSelector%3Aprop_112=Standard+Color+70&BookTypeSelector%3Aprop_113=Hardback&BookTypeSelector%3Aprop_91=Case+Laminate&BookTypeSelector%3Aprop_93=Matte&BookTypeID=4414&PageCount=389&X-Requested-With=XMLHttpRequest';
      //
      // const req = https.request(options, (res) => {
      //   let body = '';
      //
      //   res.on('data', (chunk) => {
      //     body += chunk;
      //   });
      //
      //   req.on('error', (e) => {
      //     console.log(`problem with response: ${e.message}`);
      //   });
      //
      //   res.on('end', () => {
      //     if (body) {
      //       console.log('blah response body', body);
      //     } else {
      //       console.log('no response body');
      //     }
      //   });
      // });
      //
      // req.on('error', (e) => {
      //   console.log(`problem with request: ${e.message}`);
      // });
      //
      // req.write(JSON.stringify(request));
      // req.end();


      // console.log('BUILD_COMPILATION_COVER_PDF', data);
      // User.findOne({ email: socket.request.session.passport.user })
      // .then(userIsAdmin)
      // .then(() => Compilation.findOne({ _id: data.compilationId }))
      // .then((compilation) => {
      //   return compilation.buildCoverPdf((info) => {
      //     socket.emit('COMPILATION_COVER_LOG_ENTRY', { compilationId: compilation._id, entry: info });
      //   });
      // })
      // .then(() => {
      //   return Compilation.findOne({ _id: data.compilationId });
      // })
      // .then((compilation) => {
      //   socket.emit('UPDATED_COMPILATION', compilation);
      // })
      // .catch((err) => {
      //   socket.emit('COMPILATION_COVER_LOG_ENTRY', { compilationId: data.compilationId, entry: err });
      // });

    socket.on('BUILD_COMPILATION_COVER_PDF', (data) => {
      console.log('BUILD_COMPILATION_COVER_PDF', data);
      User.findOne({ email: socket.request.session.passport.user })
      .then(userIsAdmin)
      .then(() => Compilation.findOne({ _id: data.compilationId }))
      .then((compilation) => {
        return compilation.buildCoverPdf((info) => {
          socket.emit('COMPILATION_COVER_LOG_ENTRY', { compilationId: compilation._id, entry: info });
        });
      })
      .then(() => {
        return Compilation.findOne({ _id: data.compilationId });
      })
      .then(() => {
        // socket.emit('UPDATED_COMPILATION', compilation);
      })
      .catch((err) => {
        socket.emit('COMPILATION_COVER_LOG_ENTRY', { compilationId: data.compilationId, entry: err });
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
