import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import {
  pageTemplateFactory,
  removeFile,
  processCoverImage,
  uploadPageImage,
  rotateImageAttachment,
  sanitizeEmailBody,
  sanitizeEmailBodyPreview,
} from '../util/helpers';
import { pageMeta } from '../../shared/helpers';
import { startWorker } from '../util/docker';
import * as pdfShop from '../util/pdfShop';
import { stringToSha1 } from '../../shared/helpers';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  type: String,
  html: String,
  content: {},
  position: Number,
  fullHtmlSha1: String,
  pdf: {},
  pageCount: { type: Number, default: 0 },
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

  if (_.get(this, 'content.image.content')) {
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

  if (this.propChanged('content.message') && !_.isEmpty(this.content.message)) {
    this.content.message = sanitizeEmailBody(this.content.message);
    this.content.messagePreview = sanitizeEmailBodyPreview(this.content.message).substring(0, 50);
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
    this.fullHtmlSha1 = stringToSha1(this.html);

    return Promise.resolve(this);
  })
  .catch((err) => { console.log('an error happend getting page html', err); });
};

PageSchema.methods.updatePdf = function updatePdf(force) {
  if (!force && this.pdf && this.pdf.url && this.fullHtmlSha1 === this.pdf.htmlSha1) {
    console.log('Skipping page updatePdf');
    return Promise.resolve(this);
  }
  console.log('Updating page pdf');
  return pdfShop.createPdf(this.html)
  .then((pdfRes) => {
    console.log('Results: ', pdfRes);
    this.pageCount = pdfRes.pageCount;
    this.pdf = pdfRes;
    return this.save();
  });
};

PageSchema.methods.propChanged = function propChanged(propsString) {
  const original = this._original || {};
  const current = this.toObject();

  const originalProp = _.get(original, propsString);
  const currentProp = _.get(current, propsString);

  return !_.isEqual(originalProp, currentProp);
};

PageSchema.methods.rotateContentImage = function rotateContentImage(angle) {
  angle = angle || 90;

  return new Promise((resolve) => {
    const image = this.content.image;

    return rotateImageAttachment(image, angle)
    .then((updatedImage) => {
      return uploadPageImage(updatedImage);
    })
    .then((updatedImage) => {
      this.content.image = updatedImage;
      return this.save();
    })
    .then(() => { return resolve(this); });
  });
};

PageSchema.methods.buildPdf = function buildPdf(statusCb) {
  statusCb = statusCb || function() {}; // eslint-disable-line
  return this.save()
  .then(() => {
    return startWorker({ compilationId: this._compilation, pageId: this._id, kind: 'page-pdf' }, statusCb);
  })
  .then(() => { return this; });
};

export default Mongoose.model('Page', PageSchema);
