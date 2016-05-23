import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const TaskSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  kind: String,
  props: {},
  priority: { type: Number, default: 1 }, // Scale 0-2 (low-high)
  logs: [],
  startedAt: Date,
  finishedAt: Date,
}, {
  timestamps: true,
});

export default Mongoose.model('Task', TaskSchema);
