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
  connectionValid: Boolean,
  connectionCheckedAt: Date,
}, {
  timestamps: true,
});

AccountSchema.methods.checkConnection = function checkConnection() {
  if (this.kind === 'imap') {
    return this.checkImapConnection();
  } else if (this.kind === 'google') {
    return this.checkGoogleConnection();
  }
};

AccountSchema.methods.checkGoogleConnection = function checkGoogleConnection() {
  return new Promise((resolve) => {
    resolve(this);
  });
};

AccountSchema.methods.checkImapConnection = function checkImapConnection() {
  return new Promise((resolve) => {
    const imap = initImap({
      email: this.authProps.email,
      password: this.authProps.password,
      host: this.authProps.host,
      port: this.authProps.port,
    });

    imap.connect();
    imap.on('ready', () => {
      this.connectionValid = true;
      this.connectionCheckedAt = Date.now();
      imap.end();
      resolve(this);
    });
    imap.on('error', (err) => {
      if (err.toString() === 'Error: read ECONNRESET') {
        this.connectionValid = true;
        this.connectionCheckedAt = Date.now();
        imap.end();
        resolve(this);
        return;
      }

      this.connectionValid = false;
      this.connectionCheckedAt = Date.now();
      imap.end();
      resolve(this);
    });
  });
};

AccountSchema.methods.getMailboxes = function getMailboxes() {
  return new Promise((resolve) => {
    if (this.kind === 'imap') {
      const imap = initImap({
        email: this.authProps.email,
        password: this.authProps.password,
        host: this.authProps.host,
        port: this.authProps.port,
      });

      imap.connect();
      imap.on('ready', () => {
        imap.getBoxes('', (err, boxes) => {
          if (err) {
            resolve(this);
            imap.end();
          }

          this.imap.mailboxes = [];
          _.forEach(boxes, (boxObject, boxName) => {
            if (boxObject.children && boxObject.attribs.indexOf('\\HasChildren') > -1) {
              _.forEach(boxObject.children, (childObject, childName) => {
                this.imap.mailboxes.push(boxName + boxObject.delimiter + childName);
              });
            } else {
              this.imap.mailboxes.push(boxName);
            }
          });

          imap.end();
          resolve(this);
        });
      });
      imap.on('error', () => {
        imap.end();
        resolve(this);
      });
    }
  });
};

AccountSchema.methods.filteredEmailsCount = function filteredEmailsCount(mailbox, imapFilter) {
  return new Promise((resolve) => {
    const imap = initImap({
      email: this.authProps.email,
      password: this.authProps.password,
      host: this.authProps.host,
      port: this.authProps.port,
    });

    imap.connect();
    imap.on('ready', () => {
      // imap.openBox(mailbox, true, (err, box) => {
      imap.openBox(mailbox, true, (boxErr) => {
        if (boxErr) { console.log(`Could not open mailbox ${mailbox} ${boxErr.message}`); return; }

        imap.seq.search(imapFilter, (searchErr, results) => {
          if (searchErr) { console.log(`problem searching ${searchErr.message}`); return; }

          if (results.length < 1) {
            imap.end();
            return;
          }

          resolve(results.length);
          imap.end();
        });
      });
    });
    imap.on('error', (err) => {
      if (err.toString() !== 'Error: read ECONNRESET') {
        console.log('imap error happened.');
      }
      imap.end();
      resolve();
    });
  });
};

AccountSchema.methods.filteredEmailsStream = function filteredEmailsStream(options) {
  if (this.kind === 'google') {
    return this.googlefilteredEmailsStream(options);
  }

  return this.imapfilteredEmailsStream(options);
};

AccountSchema.methods.googlefilteredEmailsStream = function googlefilteredEmailsStream(options) {
  return searchMessages(this, options);
};

AccountSchema.methods.imapfilteredEmailsStream = function imapfilteredEmailsStream(options) {
  const mailbox = options.mailbox;
  const imapFilter = imapifyFilter(options);

  const emailStream = stream.PassThrough(); // eslint-disable-line new-cap
  const imap = initImap({
    email: this.authProps.email,
    password: this.authProps.password,
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
      console.log('imap error happened.');
    }
    emailStream.end();
    imap.end();
  });

  return emailStream;
};

export default Mongoose.model('Account', AccountSchema);
