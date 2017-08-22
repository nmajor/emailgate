import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import {
  pageTemplateFactory,
  removeFile,
  processCoverImage,
  uploadPageImage,
} from '../util/helpers';
import { pageMeta } from '../../shared/helpers';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  type: String,
  html: String,
  content: {},
  position: Number,
  pdf: {},
  estimatedPageCount: { type: Number, default: 1 },
}, {
  timestamps: true,
});

PageSchema.statics.defaultPages = function defaultPages() {
  return [
    { type: 'cover' },
    { type: 'title-page' },
    // { type: 'message-page' },
    { type: 'table-of-contents' },
  ];
};

PageSchema.post('init', function () {  // eslint-disable-line func-names
  this.position = this.position || pageMeta(this).position;
  this._original = this.toObject();
});

PageSchema.pre('save', function (next) { // eslint-disable-line func-names
  let tasks = Promise.resolve();

  if (this.content.image && this.content.image.content) {
    tasks = tasks.then(() => {
      return processCoverImage(this.content.image)
      .then((resizedImage) => {
        resizedImage._compilation = this._compilation;
        return uploadPageImage(resizedImage)
        .catch((err) => { console.log('An error happened uploading page image', err); });
      })
      .then((image) => {
        this.content.image = image;
        return Promise.resolve(this);
      });
    });
  }

  tasks = tasks.then(() => { return this.getHtml(); });

  tasks.then(() => { next(); });
});

PageSchema.post('remove', (doc) => {
  if (doc.pdf && doc.pdf.path) {
    removeFile(doc.pdf.path);
  }
});

PageSchema.methods.getHtml = function getHtml() {
  return pageTemplateFactory(this)
  .then((template) => {
    this.html = template.toString();

    return Promise.resolve(this);
  })
  .catch((err) => { console.log('an error happend getting page html', err); });
};

PageSchema.methods.propChanged = function propChanged(propsString) {
  const original = this._original || {};
  const current = this.toObject();

  const originalProp = _.get(original, propsString);
  const currentProp = _.get(current, propsString);

  return !_.isEqual(originalProp, currentProp);
};

export default Mongoose.model('Page', PageSchema);
