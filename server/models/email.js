import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
// import { emailPdfToBuffer } from '../util/pdf';
// import pdfjs from 'pdfjs-dist';
import EmailTemplate from '../../shared/templates/email';
import queue from '../queue';
import _ from 'lodash';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  date: Date,
  mid: String,
  to: [],
  from: [],
  subject: String,
  body: String,
  template: String,
  attachments: [],
  pdf: {},
}, {
  timestamps: true,
});

EmailSchema.post('init', function () {  // eslint-disable-line func-names
  this._original = this.toObject();
});

EmailSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.getTemplateHtml()
  .then(() => {
    if (this.propChanged('body') || this.propChanged('template')) {
      return this.schedulePdfJob();
    }

    return Promise.resolve(this);
  })
  .then(() => {
    next();
  });
});

EmailSchema.methods.schedulePdfJob = function schedulePdfJob() {
  queue.create('worker', {
    title: `Building pdf file for email ${this._id}`,
    kind: 'email-pdf',
    referenceModel: 'email',
    referenceId: this._id,
  })
  .searchKeys(['referenceModel', 'referenceId'])
  .removeOnComplete(true)
  .attempts(3)
  .save((err) => {
    if (err) console.log('An error happened adding email-pdf job to queue');
  });
};

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
