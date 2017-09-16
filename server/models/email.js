import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Page from './page';
import {
  sanitizeEmailBody,
  sanitizeEmailBodyPreview,
  resizeAttachment,
  uploadAttachment,
  trimKnownBodyFluff,
  removeFile,
  rotateImageAttachment,
} from '../util/helpers';

import EmailTemplate from '../../shared/templates/email';
import _ from 'lodash';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  remote_id: String,
  date: { type: Date, default: new Date(0) },
  mid: String,
  to: [],
  from: [],
  subject: String,
  body: String,
  bodyPreview: String,
  template: String,
  attachments: [],
  estimatedPageCount: { type: Number, default: 3 },
  pdf: {},
}, {
  timestamps: true,
});

EmailSchema.post('init', function () {  // eslint-disable-line func-names
  this._original = this.toObject();
});

EmailSchema.post('remove', (doc) => {
  Page.findOne({ _compilation: doc._compilation, type: 'table-of-contents' })
  .then((page) => {
    if (page) { return page.save(); }
  });

  _.forEach(doc.attachments, (attachment) => {
    removeFile(attachment.path);
  });

  if (doc.pdf && doc.pdf.path) {
    removeFile(doc.pdf.path);
  }
});

EmailSchema.pre('save', function (next) { // eslint-disable-line func-names
  Promise.resolve()
  .then(() => {
    const oldAttachments = _.filter(this.attachments, (a) => { return a.url && !a.content; });
    let newAttachments = _.filter(this.attachments, (a) => { return a.content && !a.url; });

    newAttachments = _.map(newAttachments, (a) => {
      a._compilation = this._id;
      return a;
    });

    if (newAttachments.length > 0) {
      return Promise.all(newAttachments.map((attachment) => {
        return resizeAttachment(attachment);
      }))
      .then((resizedAttachments) => {
        return Promise.all(resizedAttachments.map((attachment) => {
          return uploadAttachment(attachment);
        }))
        .catch((err) => { console.log('An error happened uploading attachments', err, err.stack); });
      })
      .then((newUploadedAttachments) => {
        this.attachments = [
          ...oldAttachments,
          ...newUploadedAttachments,
        ];
        return Promise.resolve(this);
      });
    }

    return Promise.resolve(this);
  })
  .then(() => {
    if (this.propChanged('body') && !_.isEmpty(this.body)) {
      this.body = trimKnownBodyFluff(this.body);
      this.body = sanitizeEmailBody(this.body);
    }

    return Promise.resolve(this);
  })
  .then(() => {
    return this.getTemplateHtml();
  })
  .then(() => {
    if (this.propChanged('body')) {
      this.bodyPreview = sanitizeEmailBodyPreview(this.body);
    }

    return Promise.resolve(this);
  })
  .then(() => {
    next();
  })
  .catch((err) => { console.log('An error happened when saving an email', err); });
});

EmailSchema.methods.getTemplateHtml = function getTemplateHtml() {
  return new Promise((resolve) => {
    const email = Object.assign({}, this.toObject(), { body: '[[BODY]]' });
    const template = new EmailTemplate(email);
    const html = template.toString();
    this.template = html;
    resolve(this);
  });
};

EmailSchema.methods.rotateImageAttachment = function (attachmentContentId, angle) { // eslint-disable-line func-names
  return new Promise((resolve) => {
    const attachmentIndex = _.findIndex(this.attachments, (attachment) => { return attachment.contentId === attachmentContentId; });
    const attachment = this.attachments[attachmentIndex];

    rotateImageAttachment(attachment, angle)
    .then((updatedAttachment) => {
      return uploadAttachment(updatedAttachment);
    })
    .then((updatedAttachment) => {
      this.attachments = [
        ...this.attachments.slice(0, attachmentIndex),
        updatedAttachment,
        ...this.attachments.slice(attachmentIndex + 1),
      ];
      return this.save();
    })
    .then(() => { return resolve(this); });
  });
};

EmailSchema.methods.propChanged = function propChanged(propsString) {
  const original = this._original || {};
  const current = this.toObject();

  const originalProp = _.get(original, propsString);
  const currentProp = _.get(current, propsString);

  return !_.isEqual(originalProp, currentProp);
};

export default Mongoose.model('Email', EmailSchema);
