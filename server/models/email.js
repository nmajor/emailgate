import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  date: Date,
  mid: String,
  to: [],
  from: [],
  subject: String,
  body: String,
  attachments: [],
});

export default Mongoose.model('Email', EmailSchema);
