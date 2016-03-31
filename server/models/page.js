import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'User' },
  type: String,
  content: {},
});

PageSchema.statics.defaultPages = function defaultPages() {
  return [
    { type: 'cover' },
    { type: 'title-page' },
    { type: 'message-page' },
    { type: 'table-of-contents' },
  ];
};


export default Mongoose.model('Page', PageSchema);
