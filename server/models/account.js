import Mongoose, { Schema } from 'mongoose';
import { initImap } from '../util/imap';
import { searchMessages } from '../util/googleAuth';
import _ from 'lodash';
import stream from 'stream';
import { MailParser } from 'mailparser';
import shortid from 'shortid';
import { imapifyFilter } from '../util/helpers';

const AccountSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  email: String,
  kind: { type: String, default: 'imap' },
  authProps: {},
}, {
  timestamps: true,
});

AccountSchema.virtual('connectionValid').get(function getConnectionValid() {
  if (this.kind === 'google') {
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

AccountSchema.methods.checkImapConnection = function checkImapConnection(password) {
  return new Promise((resolve) => {
    if (this.kind === 'imap') {
      const imap = initImap({
        email: this.email,
        password,
        host: this.authProps.host,
        port: this.authProps.port,
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

          this.authProps.mailboxes = mailboxes;
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
        this.set('connectionValid', false);
        return resolve(this);
      });
    }
  });
};

AccountSchema.methods.filteredEmailsStream = function filteredEmailsStream(options, password) {
  if (this.kind === 'google') {
    return this.googlefilteredEmailsStream(options);
  }

  return this.imapfilteredEmailsStream(options, password);
};

AccountSchema.methods.googlefilteredEmailsStream = function googlefilteredEmailsStream(options) {
  return searchMessages(this, options);
};

AccountSchema.methods.imapfilteredEmailsStream = function imapfilteredEmailsStream(options, password) {
  const mailbox = options.mailbox;
  const imapFilter = imapifyFilter(options);
  console.log('blah imapfilteredEmailsStream');
  console.log({
    email: this.email,
    password,
    host: this.authProps.host,
    port: this.authProps.port,
  });

  const emailStream = stream.PassThrough(); // eslint-disable-line new-cap
  const imap = initImap({
    email: this.email,
    password,
    host: this.authProps.host,
    port: this.authProps.port,
  });

  imap.connect();
  imap.on('ready', () => {
    imap.openBox(mailbox, true, (boxErr) => {
      if (boxErr) { console.log(`Could not open mailbox ${mailbox} ${boxErr.message}`); return; }

      imap.seq.search(imapFilter, (searchErr, results) => {
        if (searchErr) { console.log(`problem searching ${searchErr.message}`); return; }

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
              emailStream.write(new Buffer(JSON.stringify(msgObj)));
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
      console.log(`imap error happened. ${err}`);
    }
    emailStream.end();
    imap.end();
  });

  return emailStream;
};

export default Mongoose.model('Account', AccountSchema);
