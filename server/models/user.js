import Mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import shortid from 'shortid';
import { sendMail } from '../util/mail';
import crypto from 'crypto';
import Compilation from './compilation';
import Account from './account';
import Address from './address';
import Cart from './cart';
import Order from './order';

const UserSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  name: String,
  email: String,
  isTmp: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  appState: {
    showCoverHelp: { type: Boolean, default: true },
    showAddHelp: { type: Boolean, default: true },
    showEditHelp: { type: Boolean, default: true },
    showMobileGreeting: { type: Boolean, default: true },
  },
}, {
  timestamps: true,
});

UserSchema.post('init', function () {  // eslint-disable-line func-names
  const admins = [
    'nick@nmajor.com',
    'king.benjamin012@gmail.com',
  ];

  this.isAdmin = admins.indexOf(this.email) > -1;
});

function formattedError(field, message) {
  return {
    errors: {
      [field]: { message },
    },
  };
}

function passwordValidator(password, cb) {
  if (!password || typeof(password) !== 'string' || password.length < 8) {
    return cb(formattedError('base', 'Invalid password. Must be at least 8 characters long.'));
  }

  return cb(null);
}

UserSchema.methods.absorbTmpUser = function unTmp(tmpUser) {
  return Promise.all([
    Compilation.find({ _user: tmpUser._id }),
    Account.find({ _user: tmpUser._id }),
    Address.find({ _user: tmpUser._id }),
    Cart.find({ _user: tmpUser._id }),
    Order.find({ _user: tmpUser._id }),
  ])
  .then((results) => {
    const [compilations, accounts, addresses, carts, oders] = results;

    return Promise.all([
      compilations.map((compilation) => { compilation._user = this._id; return compilation.save(); }), // eslint-disable-line no-param-reassign
      accounts.map((account) => { account._user = this._id; return account.save(); }), // eslint-disable-line no-param-reassign
      oders.map((order) => { order._user = this._id; return order.save(); }), // eslint-disable-line no-param-reassign
      addresses.map((address) => { return address.remove(); }),
      carts.map((cart) => { return cart.remove(); }),
    ]);
  })
  .then(() => {
    return tmpUser.remove();
  })
  .then(() => {
    return this;
  });
};


UserSchema.methods.unTmp = function unTmp(name, email, password) {
  this.name = name;
  this.email = email;
  this.isTmp = false;
  return this.save()
  .then((user) => {
    return user.resetPassword(password, password);
  });
};

UserSchema.methods.updatePassword = function updatePassword(currentPassword, newPassword, newPasswordConfirm) {
  return new Promise((resolve, reject) => {
    this.checkPassword(currentPassword, (err, result) => {
      if (result) {
        resolve(this.resetPassword(newPassword, newPasswordConfirm));
      } else {
        reject(formattedError('currentPassword', 'Current password is not correct.'));
      }
    });
  });
};

UserSchema.methods.resetPassword = function resetPassword(newPassword, newPasswordConfirm) {
  return new Promise((resolve, reject) => {
    if (newPassword !== newPasswordConfirm) {
      reject(formattedError('newPasswordConfirm', 'Confirm password field does not match new password.'));
    } else {
      this.setPassword(newPassword, (err, user) => { // eslint-disable-line no-shadow
        if (err) {
          reject(err);
        } else {
          user.save()
          .then((user) => { // eslint-disable-line no-shadow
            resolve(user);
          });
        }
      });
    }
  });
};

UserSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 7200000; // 2 hours

  return this.save();
};

UserSchema.methods.sendForgotPassword = function sendForgotPassword() {
  return this.generateResetPasswordToken()
  .then((savedUser) => {
    const resetPasswordUrl = `http://emailgate.nmajor.com/reset/${savedUser.resetPasswordToken}`;

    return sendMail({
      to: this.email,
      subject: 'Forgotten Password',
      html: `<h1>Forgotten Password</h1><div><a href="${resetPasswordUrl}">Click here to reset your password.<a></div>`,
    });
  });
};

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email', passwordValidator, usernameLowerCase: true });

export default Mongoose.model('User', UserSchema);
