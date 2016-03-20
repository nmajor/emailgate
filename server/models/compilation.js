import Mongoose, { Schema } from 'mongoose';

const CompilationSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  emails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
});

export default Mongoose.model('Compilation', CompilationSchema);
