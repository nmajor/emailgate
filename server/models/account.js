import Mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  email: String,
  password: String,
  host: String,
  port: String,
}, {
  timestamps: true,
});

export default Mongoose.model('Account', AccountSchema);