import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const CompilationSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  name: String,
  emails: [{ type: String, ref: 'Email' }],
});

export default Mongoose.model('Compilation', CompilationSchema);
