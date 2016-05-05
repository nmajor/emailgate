import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

import { pageHtml } from '../util/pdf';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'User' },
  type: String,
  content: {},
  html: String,
  pdf: {},
}, {
  timestamps: true,
});

PageSchema.statics.defaultPages = function defaultPages() {
  return [
    { type: 'cover' },
    { type: 'title-page' },
    { type: 'message-page' },
    { type: 'table-of-contents' },
  ];
};

PageSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.getHtml()
  .then(() => {
    next();
  });
});

PageSchema.methods.getHtml = function getHtml() {
  return pageHtml(this)
  .then((html) => {
    this.html = html;
    return Promise.resolve(this);
  });
};

export default Mongoose.model('Page', PageSchema);
