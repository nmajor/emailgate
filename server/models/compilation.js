import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Email from './email';
import Page from './page';
import _ from 'lodash';
import queue from '../queue';
import * as sharedHelpers from '../../shared/helpers';
import * as serverHelpers from '../util/helpers';

const CompilationSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  name: String,
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
  pdf: {},
}, {
  timestamps: true,
});

CompilationSchema.post('save', (doc) => {
  doc.seedPages();
});

CompilationSchema.methods.seedPages = function seedPages() {
  Page.count({ _compilation: this._id })
  .then((count) => {
    if (count === 0) {
      _.forEach(Page.defaultPages(), (pageData) => {
        const newPage = new Page(pageData);
        newPage._compilation = this._id;
        return newPage.save();
      });
    }
  });
};

CompilationSchema.methods.schedulePdfJob = function schedulePdfJob() {
  return new Promise((resolve) => {
    return Promise.all([
      this.getEmailPositionMap(),
      this.getEmailPageMap(),
      this.getPagePositionMap(),
    ]).then((results) => {
      const [emailPositionMap, emailPageMap, pagePositionMap] = results;

      const job = queue.create('worker', {
        title: `Building pdf file for compilation ${this._id}`,
        kind: 'compilation-pdf',
        referenceModel: 'compilation',
        referenceId: this._id,
        emailPositionMap,
        emailPageMap,
        pagePositionMap,
      })
      .searchKeys(['kind', 'compilationId'])
      .removeOnComplete(true)
      .attempts(3)
      .save((err) => {
        if (err) console.log('An error happened adding compilation-pdf job to queue');

        resolve(job);
      });
    });
  });
};

CompilationSchema.methods.findPdfJob = function findPdfJob() {
  queue.search();
};

CompilationSchema.methods.getEmailPositionMap = function getEmailPositionMap() {
  return Email.find({ _compilation: this._id })
  .then((emails) => {
    const sortedEmails = sharedHelpers.sortedEmails(emails);
    const positionMap = {};
    _.forEach(sortedEmails, (email, index) => {
      positionMap[email._id] = index;
    });
    return Promise.resolve(positionMap);
  });
};

CompilationSchema.methods.getEmailPageMap = function getEmailPageMap() {
  return serverHelpers.emailPageMap(this._id);
};

CompilationSchema.methods.getPagePositionMap = function getPagePositionMap() {
  return Page.find({ _compilation: this._id })
  .then((pages) => {
    const sortedPages = sharedHelpers.sortedPages(pages);
    const positionMap = {};
    _.forEach(sortedPages, (page, index) => {
      positionMap[page._id] = index;
    });
    return Promise.resolve(positionMap);
  });
};

export default Mongoose.model('Compilation', CompilationSchema);
