import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Page from './page';
import { sanitizeEmailBody, sanitizeEmailBodyPreview, resizeAttachment } from '../util/helpers';
import EmailTemplate from '../../shared/templates/email';
import _ from 'lodash';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  remote_id: String,
  date: { type: Date, default: new Date },
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
    return page.save();
  });
});

EmailSchema.pre('save', function (next) { // eslint-disable-line func-names
  Promise.resolve()
  .then(() => {
    if (this.propChanged('attachments')) {
      // console.log('blah attachments', this.attachments);
      this.attachments = _.filter(this.attachments, (a) => { return a.content; });
      return Promise.all(this.attachments.map((attachment) => {
        return resizeAttachment(attachment)
        .then((thing) => {
          return Promise.resolve(thing);
        });
      }))
      .then((resizedAttachments) => {
        this.attachments = resizedAttachments;
        return Promise.resolve(this);
      });
    }

    return Promise.resolve(this);
  })
  .then(() => {
    if (this.propChanged('body') && !_.isEmpty(this.body)) {
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
  });
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

EmailSchema.methods.propChanged = function propChanged(propsString) {
  const original = this._original || {};
  const current = this.toObject();

  const originalProp = _.get(original, propsString);
  const currentProp = _.get(current, propsString);

  return !_.isEqual(originalProp, currentProp);
};

export default Mongoose.model('Email', EmailSchema);
