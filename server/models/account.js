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

AccountSchema.methods.validate = function validate() {
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
      });
      imap.on('error', () => {
        this.connectionValid = false;
        this.connectionCheckedAt = Date.now();
        this.update();
        resolve(this);
      });
    }
  });
};

export default Mongoose.model('Account', AccountSchema);
