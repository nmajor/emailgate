import Mongoose, { Schema } from 'mongoose';

const EmailSchema = new Schema({
  _compilation: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  mid: String,
  to: [],
  from: [],
  subject: String,
  text: String,
  attachments: [],
});

export default Mongoose.model('Email', EmailSchema);
