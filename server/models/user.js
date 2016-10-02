import Mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import shortid from 'shortid';
import { sendMail } from '../util/mail';
import crypto from 'crypto';

const UserSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  name: String,
  email: String,
  isAdmin: { type: Boolean, default: false },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  accounts: [{ type: String, ref: 'Account' }],
  compilations: [{ type: String, ref: 'Compilation' }],
}, {
  timestamps: true,
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

UserSchema.methods.updatePassword = function updatePassword(currentPassword, newPassword, newPasswordConfirm) {
  return new Promise((resolve, reject) => {
    this.checkPassword(currentPassword, (err, passwordValid) => {
      if (passwordValid) {
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

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email', passwordValidator });

export default Mongoose.model('User', UserSchema);
