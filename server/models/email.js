import Mongoose, { Schema } from 'mongoose';

const EmailSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  emails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
});

export default Mongoose.model('Email', EmailSchema);
