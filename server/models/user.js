import Mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import shortid from 'shortid';

const UserSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  name: String,
  email: String,
  password: String,
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

UserSchema.methods.updatePassword = function updatePassword(currentPassword, newPassword, newPasswordConfirm) {
  return new Promise((resolve, reject) => {
    this.checkPassword(currentPassword, (err, passwordValid) => {
      if (passwordValid) {
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
      } else {
        reject(formattedError('currentPassword', 'Current password is not correct.'));
      }
    });
  });
};

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default Mongoose.model('User', UserSchema);
