import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import Email from './email';
import Page from './page';
import * as sharedHelpers from '../../shared/helpers';
import * as serverHelpers from '../util/helpers';
import { startWorker } from '../util/docker';
import CaseboundCover from '../../shared/templates/caseboundCover';

const CompilationCoverSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  style: { type: String, default: 'casebound' },
  spineWidth: Number,
  height: Number,
  width: Number,
  html: String,
  pdf: {},
}, {
  timestamps: true,
});

const CompilationSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  title: String,
  subtitle: String,
  cover: { type: CompilationCoverSchema, default: {} },
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
  pdf: {},
}, {
  timestamps: true,
});

CompilationSchema.methods.updateEmails = function updateEmails() {
  return Email.find({ _compilation: this._id })
  .select('_id')
  .then((emails) => {
    this.emails = emails;
    return this.save();
  });
};

CompilationSchema.methods.updatePages = function updatePages() {
  return Page.find({ _compilation: this._id })
  .select('_id')
  .then((pages) => {
    this.pages = pages;
    return this.save();
  });
};

CompilationSchema.methods.buildCoverPdf = function buildCoverPdf(statusCb) {
  return this.updateCoverDimentions()
  .then(() => { return Email.find({ _compilation: this._id }); })
  .then((emails) => {
    console.log('blah hey 0');
    const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
    const firstEmail = sortedEmails[0] || {};
    const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
    const startDate = firstEmail.date;
    const endDate = lastEmail.date;

    const template = new CaseboundCover({ compilation: this, startDate, endDate });

    this.cover.html = template.toString();
    return this.save()
    .then(() => {
      console.log('blah hey 1');
      return startWorker({ compilationId: this.id, kind: 'compilation-cover-pdf' }, statusCb);
    });
  });
};

CompilationSchema.methods.updateCoverDimentions = function getCoverDimentions() {
  const template = new CaseboundCover({ compilation: this });
  const dimentions = template.getCoverDimentions();

  this.cover.height = dimentions.height;
  this.cover.width = dimentions.width;
  return this.save();
};

CompilationSchema.methods.seedPages = function seedPages() {
  return Page.count({ _compilation: this._id })
  .then((count) => {
    if (count === 0) {
      return Promise.all(Page.defaultPages().map((pageData) => {
        const newPage = new Page(pageData);
        newPage._compilation = this._id;
        return newPage.save();
      }))
      .then(() => {
        return this.updatePages();
      });
    }
  });
};

CompilationSchema.methods.buildPdf = function buildPdf(statusCb) {
  statusCb = statusCb || function() {}; // eslint-disable-line

  return startWorker({ compilationId: this.id, kind: 'compilation-emails-pdf' }, statusCb)
  .then(() => {
    return Page.find({ _compilation: this._id, type: { $in: ['table-of-contents', 'title-page'] } })
    .then((pages) => {
      return Promise.all(pages.map((page) => {
        return page.save();
      }));
    });
  })
  .then(() => {
    return startWorker({ compilationId: this.id, kind: 'compilation-pages-pdf' }, statusCb);
  })
  .then(() => {
    return Promise.all([
      this.getEmailPositionMap(),
      this.getEmailPageMap(),
      this.getPagePositionMap(),
    ]);
  })
  .then((results) => {
    const [emailPositionMap, emailPageMap, pagePositionMap] = results;

    return startWorker({
      compilationId: this.id,
      kind: 'compilation-pdf',
      emailPositionMap,
      emailPageMap,
      pagePositionMap,
    }, statusCb);
  });
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
