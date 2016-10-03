import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Email from './email';
import Page from './page';

const CompilationSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  title: String,
  subtitle: String,
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
  pdf: {},
  approvedAt: Date,
}, {
  timestamps: true,
});

CompilationSchema.virtual('emailsCount').get(function getConnectionValid() {
  return this._emailsCount;
});

CompilationSchema.virtual('emailsCount').set(function setConnectionValid(val) {
  this._emailsCount = val;
  return;
});

CompilationSchema.set('toObject', {
  getters: true,
  virtuals: true,
});

CompilationSchema.set('toJSON', {
  getters: true,
  virtuals: true,
});

CompilationSchema.post('init', (doc, next) => {
  Email.count({ _compilation: doc._id })
  .then((emailsCount) => {
    doc.set('emailsCount', emailsCount);
    next();
  });
});

CompilationSchema.methods.seedPages = function seedPages() {
  return Page.count({ _compilation: this._id })
  .then((count) => {
    if (count === 0) {
      return Promise.all(Page.defaultPages().map((pageData) => {
        const newPage = new Page(pageData);
        newPage._compilation = this._id;
        return newPage.save();
      }));
    }
  });
};

CompilationSchema.methods.buildPdf = function buildPdf() {
  console.log('blah buildPdf');
};

export default Mongoose.model('Compilation', CompilationSchema);
