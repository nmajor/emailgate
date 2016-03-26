import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'User' },
  type: String,
  desc: String,
  content: {},
});

PageSchema.statics.defaultPages = function defaultPages() {
  return [
    {
      type: 'title-page',
      desc: 'Title Page',
    },
    {
      type: 'message-page',
      desc: 'Message Page',
    },
    {
      type: 'table-of-contents',
      desc: 'Table of Contents',
    },
  ];
};


export default Mongoose.model('Page', PageSchema);
