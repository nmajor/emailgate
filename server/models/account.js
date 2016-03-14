import Mongoose, { Schema } from 'mongoose';
import { initImap } from '../util/imap';

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
        this.update();
        resolve(this);
        imap.end();
      });
      imap.on('error', (err) => {
        if (err.toString() === 'Error: read ECONNRESET') {
          this.connectionValid = true;
          this.connectionCheckedAt = Date.now();
          this.update();
          resolve(this);
          imap.end();
        }

        this.connectionValid = false;
        this.connectionCheckedAt = Date.now();
        this.update();
        imap.end();
        resolve(this);
      });
    }
  });
};

export default Mongoose.model('Account', AccountSchema);
