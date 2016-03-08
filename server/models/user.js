import Mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  accounts: [{ type: Schema.Types.ObjectId, ref: 'Count' }],
  compilations: [{ type: Schema.Types.ObjectId, ref: 'Compilation' }],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default Mongoose.model('User', UserSchema);
