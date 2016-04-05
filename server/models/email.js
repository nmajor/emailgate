import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import { emailPdfToBuffer } from '../util/pdf';
import pdfjs from 'pdfjs-dist';

const EmailSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  date: Date,
  mid: String,
  to: [],
  from: [],
  subject: String,
  body: String,
  attachments: [],
  pdfPageCount: Number,
  pdf: {},
});

EmailSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.countPdfPages()
  .then(() => { next(); });
});

EmailSchema.methods.countPdfPages = function () { // eslint-disable-line func-names
  const thisEmail = this;
  return new Promise((resolve) => {
    emailPdfToBuffer(this)
    .then((pdfBuffer) => {
      pdfjs.getDocument(pdfBuffer).then((doc) => {
        thisEmail.pdfPageCount = doc.numPages;
        resolve(thisEmail);
      });
    });
  });
};

export default Mongoose.model('Email', EmailSchema);
