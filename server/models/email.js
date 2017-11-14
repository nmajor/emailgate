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
  getAllImageSources,
  downloadFile,
  replaceImgTag,
} from '../util/helpers';
import { startWorker } from '../util/docker';

import EmailTemplate, { addEmbeddedAttachmentsToEmailBody } from '../../shared/templates/book/email';
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
  subjectHtml: String,
  body: String,
  bodyPreview: String,
  template: String,
  attachments: [],
  attachmentStyle: { type: String, default: 'default' },
  estimatedPageCount: { type: Number, default: 3 },
  pdf: {},
  source: { type: String, default: 'gmail' },
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
    if (this.source === 'blogger' && !this._original) {
      this.attachmentStyle = 'embedded';
      return this.processEmbeddedImages();
    }

    return this.processEmailAttachments();
  })
  .then(() => {
    if (this.propChanged('body') && !_.isEmpty(this.body)) {
      this.body = sanitizeEmailBody(this.body);
      this.body = trimKnownBodyFluff(this.body);
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
    // const email = Object.assign({}, this.toObject(), { body: '[[BODY]]' });
    const template = new EmailTemplate(addEmbeddedAttachmentsToEmailBody(this));
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

EmailSchema.methods.buildPdf = function buildPdf(statusCb) {
  statusCb = statusCb || function() {}; // eslint-disable-line
  return this.save()
  .then(() => {
    return startWorker({ compilationId: this._compilation, emailId: this._id, kind: 'email-pdf' }, statusCb);
  })
  .then(() => { return this; });
};

EmailSchema.methods.processEmailAttachments = function processEmailAttachments() {
  const oldAttachments = _.filter(this.attachments, (a) => { return a.url && !a.content; });
  let newAttachments = _.filter(this.attachments, (a) => { return a.content && !a.url; });

  newAttachments = _.map(newAttachments, (a) => {
    a._compilation = this._compilation;
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
};

EmailSchema.methods.hasUnprocessedEmbeddedImages = function hasUnprocessedEmbeddedImages() {
  return this.body.indexOf('<img') > -1;
};

EmailSchema.methods.processEmbeddedImages = function processEmbeddedImages() {
  const imageUrls = getAllImageSources(this.body);
  let tasks = Promise.resolve();

  _.forEach(imageUrls, (imageUrl) => {
    tasks = tasks.then(() => {
      return downloadFile(imageUrl)
      .then((attachment) => {
        attachment._id = shortid.generate();
        attachment._compilation = this._compilation;
        return resizeAttachment(attachment);
      })
      .then((attachment) => {
        return uploadAttachment(attachment);
      })
      .then((attachment) => {
        attachment.originalSrc = imageUrl;
        attachment.tagPlaceholder = `ATTACHMENT-PLACEHOLDER-${attachment._id}`;

        this.attachments = [
          ...this.attachments,
          attachment,
        ];

        this.body = replaceImgTag(this.body, attachment.originalSrc, attachment.tagPlaceholder);
        return Promise.resolve(this);
      })
      .catch((err) => { console.log('an error happened when processing embedded images', err); });
    });
  });

  return tasks;
};


export default Mongoose.model('Email', EmailSchema);
