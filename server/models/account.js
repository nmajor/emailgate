import Mongoose, { Schema } from 'mongoose';
import { initImap } from '../util/imap';
import _ from 'lodash';
import stream from 'stream';
import { MailParser } from 'mailparser';

const AccountSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  kind: { type: String, default: 'imap' },
  imap: {
    mailboxes: [],
  },
  email: String,
  password: String,
  host: String,
  port: String,
  connectionValid: Boolean,
  connectionCheckedAt: Date,
}, {
  timestamps: true,
});

AccountSchema.methods.checkConnection = function checkConnection() {
  return new Promise((resolve) => {
    if (this.kind === 'imap') {
      const imap = initImap({
        email: this.email,
        password: this.password,
        host: this.host,
        port: this.port,
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
        }

        this.connectionValid = false;
        this.connectionCheckedAt = Date.now();
        imap.end();
        resolve(this);
      });
    }
  });
};

AccountSchema.methods.getMailboxes = function getMailboxes() {
  return new Promise((resolve) => {
    if (this.kind === 'imap') {
      const imap = initImap({
        email: this.email,
        password: this.password,
        host: this.host,
        port: this.port,
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

AccountSchema.methods.filteredEmailStream = function filteredEmailStream(mailbox, imapFilter) {
  return new Promise((resolve) => {
    const emailStream = stream.PassThrough(); // eslint-disable-line new-cap
    const imap = initImap({
      email: this.email,
      password: this.password,
      host: this.host,
      port: this.port,
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
            emailStream.end();
            return;
          }

          resolve({ count: results.length, stream: emailStream });

          const f = imap.seq.fetch(results, { bodies: '' });
          f.on('message', (msg, seqno) => {
            // msg.on('body', (msgStream, info) => {
            msg.on('body', (msgStream) => {
              const mailparser = new MailParser();
              mailparser.on('end', (msgObj) => {
                msgObj.seqno = seqno; // eslint-disable-line no-param-reassign
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
    imap.on('error', () => {
      imap.end();
    });
  });
};

export default Mongoose.model('Account', AccountSchema);
