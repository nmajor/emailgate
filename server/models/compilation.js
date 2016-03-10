import Mongoose, { Schema } from 'mongoose';

const CompilationSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
});

export default Mongoose.model('Compilation', CompilationSchema);
