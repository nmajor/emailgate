import Mongoose, { Schema } from 'mongoose';
import { initImap } from '../util/imap';
import _ from 'lodash';

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

export default Mongoose.model('Account', AccountSchema);
