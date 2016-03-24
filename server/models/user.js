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
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default Mongoose.model('User', UserSchema);
