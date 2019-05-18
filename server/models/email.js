import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import * as pdfShop from '../util/pdfShop';
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
import { stringToSha1 } from '../../shared/helpers';

import EmailTemplate, { addEmbeddedAttachmentsToEmailBody } from '../../shared/templates/email';
import _ from 'lodash';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  remote_id: String,
  date: { type: Date, default: Date.now },
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
  pageCount: { type: Number, default: 0 },
  fullHtmlSha1: String,
  pdf: {},
  source: { type: String, default: 'gmail' },
  _account: { type: String, ref: 'Account' },
}, {
  timestamps: true,
});

EmailSchema.virtual('reProcessImages').get(function () { // eslint-disable-line func-names
  return this._reProcessImages || undefined;
});

EmailSchema.virtual('reProcessImages').set(function (val) { // eslint-disable-line func-names
  this._reProcessImages = val;
  return;
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
    if (this.source === 'blogger' && (!this._original || this.reProcessImages)) {
      let tasks = Promise.resolve();
      if (this.attachments) {
        _.forEach(this.attachments, (attachment) => {
          tasks = tasks.then(() => {
            return removeFile(attachment.path)
            .then(() => {
              const attIndex = _.findIndex(this.attachments, { _id: attachment._id });
              this.attachments = [
                ...this.attachments.slice(0, attIndex),
                ...this.attachments.slice(attIndex + 1),
              ];
            });
          });
        });
      }
      this.attachmentStyle = 'embedded';
      tasks = tasks.then(() => { return this.processEmbeddedImages(); });
      return tasks;
    }

    return this.processEmailAttachments();
  })
  .then(() => {
    this.body = this.body.replace(/\<(p|span)\>[a-zA-Z0-9_]{0,15}\.(jpg|jpeg|png)\<\/(p|span)\>/gi, '').replace(/\<(p|span)\>(<>|&lt;&gt;)\<\/(p|span)\>/g, '').replace(/\<(p|span)\>(SANY|IMG|DSC)_?[0-9_]{0,10}\<\/(p|span)\>/g, '');

    // .replace(/\<br\s?\/?\>\s?\"?undefined\"?/, '<br />')

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
  .catch((err) => { console.log('An error happened when saving an email', err, err.stack); });
});

EmailSchema.methods.getTemplateHtml = function getTemplateHtml() {
  return new Promise((resolve) => {
    // const email = Object.assign({}, this.toObject(), { body: '[[BODY]]' });
    const template = new EmailTemplate(addEmbeddedAttachmentsToEmailBody(this));
    const html = template.toString();
    this.template = html;

    const fullHtml = this.template.replace('[[BODY]]', this.body);
    this.fullHtmlSha1 = stringToSha1(fullHtml);
    console.log('blah hello fullHtmlSha1', this.fullHtmlSha1);

    resolve(this);
  });
};

EmailSchema.methods.updatePdf = function updatePdf() {
  if (this.pdf && this.fullHtmlSha1 === this.pdf.htmlSha1) {
    return Promise.resolve(this);
  }

  const html = this.template.replace('[[BODY]]', this.body);
  return pdfShop.createPdf(html)
  .then((pdfRes) => {
    console.log('blah hello pdfRes', pdfRes);
    this.pageCount = pdfRes.pageCount;
    this.pdf = pdfRes;
    return this.save();
  }).catch((err) => console.log(`There was an error building the pdf for email ${this._id}, from compilation ${this._compilation}`, err));
};

EmailSchema.methods.rotateImageAttachment = function (attachmentContentId, angle) { // eslint-disable-line func-names
  return new Promise((resolve) => {
    const attachmentIndex = _.findIndex(this.attachments, (attachment) => { return attachment._id === attachmentContentId || attachment.md5 === attachmentContentId || attachment.contentId === attachmentContentId; });
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
      return this.save()
      .catch((er) => {console.log('blah hey error saging', er);});
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
    a._id = shortid.generate();
    return a;
  });

  if (newAttachments.length > 0) {
    return Promise.all(newAttachments.map((attachment) => {
      return resizeAttachment(attachment);
    }))
    .then((resizedAttachments) => {
      return Promise.all(resizedAttachments.map((attachment) => {
        return uploadAttachment(attachment)
        .then((savedAttachment) => {
          savedAttachment.saving = undefined;
          return savedAttachment;
        });
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
