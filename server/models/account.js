import Mongoose, { Schema } from 'mongoose';
import { initImap } from '../util/imap';
import * as googleAuth from '../util/googleAuth';
import _ from 'lodash';
import stream from 'stream';
import { MailParser } from 'mailparser';
import shortid from 'shortid';
import { imapifyFilter } from '../util/helpers';
import * as blog from '../util/blog';
import config from '../config';

const AccountSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  email: String,
  kind: { type: String, default: 'imap' },
  props: {},
}, {
  timestamps: true,
});

AccountSchema.virtual('connectionValid').get(function getConnectionValid() {
  if (this.kind === 'google' || this.kind === 'blog') {
    return true;
  }

  return this._connectionValid;
});

AccountSchema.virtual('connectionValid').set(function setConnectionValid(val) {
  this._connectionValid = val;
  return;
});

AccountSchema.set('toObject', {
  getters: true,
  virtuals: true,
});

AccountSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

AccountSchema.pre('save', function (next) { // eslint-disable-line func-names
  if (this.kind === 'blog') {
    blog.findFeedPath(this)
    .then((results) => {
      if (results.length > 0) {
        this.props = this.props || {};
        this.props.feedUrls = results;
        return Promise.resolve(this);
      }

      const err = new Error('Could not find a valid rss feed');
      return next(err);
    })
    .then(() => {
      return blog.findBloggerId(this);
    })
    .then((id) => {
      this.props.bloggerId = id;
      next();
    })
    .catch((err) => { console.log('an error happened when saving an account', err); });
  } else {
    next();
  }
});

AccountSchema.methods.checkImapConnection = function checkImapConnection(password) {
  return new Promise((resolve) => {
    if (this.kind === 'imap') {
      const imap = initImap({
        email: this.email,
        password,
        host: this.props.host,
        port: this.props.port,
      });

      imap.connect();
      imap.on('ready', () => {
        imap.getBoxes('', (err, boxes) => {
          if (err) {
            imap.end();
            this.set('connectionValid', true);
            return resolve(this);
          }
          const mailboxes = [];

          _.forEach(boxes, (boxObject, boxName) => {
            if (boxObject.children && boxObject.attribs.indexOf('\\HasChildren') > -1) {
              _.forEach(boxObject.children, (childObject, childName) => {
                mailboxes.push(boxName + boxObject.delimiter + childName);
              });
            } else {
              mailboxes.push(boxName);
            }
          });

          this.props.mailboxes = mailboxes;
          this.update();
          imap.end();
          this.set('connectionValid', true);
          return resolve(this);
        });
      });
      imap.on('error', (err) => {
        if (err.toString() === 'Error: read ECONNRESET') {
          imap.end();
          this.set('connectionValid', true);
          return resolve(this);
        }

        imap.end();
        console.log(err);
        this.set('connectionValid', false);
        return resolve(this);
      });
    }
  });
};

AccountSchema.methods.filteredEmails = function filteredEmails(options) {
  if (this.kind === 'google') {
    return this.googlefilteredEmails(options.filter);
  } else if (this.kind === 'blog') {
    return this.blogFilteredEmails(options.filter);
  }

  // return this.imapfilteredEmailsStream(options.filter, options.password, options.countCb, options.errCb);
};

AccountSchema.methods.blogFilteredEmails = function blogFilteredEmails(options) { // eslint-disable-line
  return blog.requestFeed(this, options);
};

AccountSchema.methods.filteredEmailsStream = function filteredEmailsStream(options) {
  if (this.kind === 'google') {
    return this.googlefilteredEmailsStream(options.filter);
  }

  return this.imapfilteredEmailsStream(options.filter, options.password, options.countCb, options.errCb);
};

AccountSchema.methods.googlefilteredEmailsStream = function googlefilteredEmailsStream(options) {
  return googleAuth.searchMessagesStream(this, options);
};

AccountSchema.methods.googlefilteredEmails = function googlefilteredEmails(options) {
  return googleAuth.searchMessages(this, options);
};

AccountSchema.methods.imapfilteredEmailsStream = function imapfilteredEmailsStream(options, password, countCb, errCb) {
  const mailbox = options.mailbox;
  const imapFilter = imapifyFilter(options);

  const emailStream = stream.PassThrough(); // eslint-disable-line new-cap

  const imap = initImap({
    email: this.email,
    password,
    host: this.props.host,
    port: this.props.port,
  });

  imap.connect();
  imap.on('ready', () => {
    imap.openBox(mailbox, true, (boxErr) => {
      if (boxErr) {
        errCb({ base: [`Could not open mailbox ${mailbox} ${boxErr.message}`] });
        imap.end();
        emailStream.end();
        return;
      }

      imap.seq.search(imapFilter, (searchErr, results) => {
        if (searchErr) {
          errCb({ base: [`problem searching ${searchErr.message}`] });
          imap.end();
          emailStream.end();
          return;
        }

        countCb(results.length);
        if (results.length > config.maxFilteredEmails) {
          errCb({ base: [`${results.length} results. Please narrow your search parameters.`] });
          imap.end();
          emailStream.end();
          return;
        }

        if (results.length < 1) {
          imap.end();
          emailStream.end();
          return;
        }

        const f = imap.seq.fetch(results, { bodies: '' });
        f.on('message', (msg) => {
          msg.on('body', (msgStream) => {
            const mailparser = new MailParser();
            mailparser.on('end', (msgObj) => {
              try {
                emailStream.write(new Buffer(JSON.stringify(msgObj)));
              } catch (err) { console.log('error', err); }
            });

            msgStream.pipe(mailparser);
          });
        });

        f.on('error', (err) => {
          if (err) { console.log(err); return; }
        });
        f.on('end', () => {
          imap.closeBox(() => {
            imap.end();
            emailStream.end();
          });
        });
      });
    });
  });

  imap.on('error', (err) => {
    if (err.toString() !== 'Error: read ECONNRESET') {
      errCb({ base: [`imap error happened. ${err}`] });
    }
    emailStream.end();
    imap.end();
  });

  emailStream.on('finish', () => {
    imap.end();
  });

  return emailStream;
};

AccountSchema.methods.getEmailsById = function getEmailsById(ids) {
  if (this.kind === 'google') {
    const client = googleAuth.getClient(this.props.token);
    return googleAuth.getMessagesById(client, ids, { includeAttachments: true });
  } else if (this.kind === 'blog') {
    return blog.getPostsById(this, ids);
  }

  // return this.imapfilteredEmailsStream(options.filter, options.password, options.countCb, options.errCb);
};

AccountSchema.methods.getEmailById = function getEmailById(id) {
  if (this.kind === 'google') {
    const client = googleAuth.getClient(this.props.token);
    return googleAuth.getMessageById(client, id, { includeAttachments: true, resizeAttachments: true });
  } else if (this.kind === 'blog') {
    return blog.getPostById(this, id);
  }

  // return this.imapfilteredEmailsStream(options.filter, options.password, options.countCb, options.errCb);
};

AccountSchema.statics.findOrNew = function findOrNew(query) {
  return new Promise((resolve) => {
    this.findOne(query)
    .then((account) => {
      if (account) {
        resolve(account);
      } else {
        resolve(new this(query));
      }
    });
  });
};

export default Mongoose.model('Account', AccountSchema);
