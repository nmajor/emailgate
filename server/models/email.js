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

EmailSchema.methods.countPdfPages = function () { // eslint-disable-line func-names
  return new Promise((resolve) => {
    emailPdfToBuffer(this)
    .then((pdfBuffer) => {
      pdfjs.getDocument(pdfBuffer).then((doc) => {
        this.pdfPageCount = doc.numPages;
        resolve(this);
      });
    });
  });
};

export default Mongoose.model('Email', EmailSchema);
