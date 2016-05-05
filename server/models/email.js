import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
// import { emailPdfToBuffer } from '../util/pdf';
// import pdfjs from 'pdfjs-dist';
import EmailTemplate from '../../shared/templates/email';

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

EmailSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.getTemplateHtml()
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

export default Mongoose.model('Email', EmailSchema);
