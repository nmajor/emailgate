import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import Email from './email';
import Page from './page';
import * as sharedHelpers from '../../shared/helpers';
import * as serverHelpers from '../util/helpers';
import { htmlToPdf } from '../util/pdf';
import { startWorker } from '../util/docker';
import covers from '../../shared/templates/covers';

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
  coverTemplate: String,
  thumbnail: {},
  image: {},
  cover: { type: CompilationCoverSchema, default: {} },
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
  metaData: {
    startingDate: { type: Date, default: new Date },
    endingDate: { type: Date, default: new Date },
    estimatedEmailPdfPages: Number,
    estimatedPagePdfPages: Number,
  },
  pdf: {},
}, {
  timestamps: true,
});

CompilationSchema.post('init', function () {  // eslint-disable-line func-names
  this._original = this.toObject();
});

CompilationSchema.pre('save', function (next) { // eslint-disable-line func-names
  let tasks = Promise.resolve();

  if (this.image && !this.image.updatedAt) {
    tasks = tasks.then(() => { return serverHelpers.processCoverImage(this.image); })
    .then((image) => {
      this.image = image;
    });
  }

  // if (this.coverPropsChanged()) {

  tasks = tasks.then(() => { return this.buildThumbnail(); });

  // }

  tasks.then(() => {
    next();
  });
});

CompilationSchema.methods.buildThumbnail = function buildThumbnail() {
  const thumbnailOptions = {
    type: 'jpeg',             // allowed file types: png, jpeg, pdf
    quality: '75',
    height: '400px',
    width: '267px',
  };

  const startDate = this.metaData.startingDate;
  const endDate = this.metaData.endingDate;

  const template = new covers[this.coverTemplate]({ compilation: this, bleedType: 'bleedless', startDate, endDate });

  return htmlToPdf(template.frontCoverToString(), thumbnailOptions)
  .then((imgBuffer) => {
    this.thumbnail = {
      content: imgBuffer.toString('base64'),
      contentType: 'image/jpeg',
      updatedAt: Date.now(),
    };
  })
  .catch((err) => { console.log('An error happened when trying to update compilation thumbnail', err); });
};

CompilationSchema.methods.buildCoverHtml = function buildCoverHtml() {
  return this.updateCoverDimentions()
  .then(() => { return Email.find({ _compilation: this._id }); })
  .then((emails) => {
    const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
    const firstEmail = sortedEmails[0] || {};
    const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
    this.metaData.startingDate = firstEmail.date;
    this.metaData.endingDate = lastEmail.date;

    const startDate = this.metaData.startingDate;
    const endDate = this.metaData.endingDate;

    const template = new covers[this.coverTemplate]({ compilation: this, startDate, endDate });

    this.cover.html = template.toString();
  });
};

CompilationSchema.methods.updateEmails = function updateEmails() {
  return Email.find({ _compilation: this._id })
  .select('_id date estimatedPageCount')
  .then((emails) => {
    const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
    this.metaData.startindDate = (sortedEmails[0] || {}).date;
    this.metaData.endingDate = (sortedEmails[(sortedEmails.length - 1)] || {}).date;
    this.metaData.estimatedEmailPdfPages = emails.map((e) => { return e.estimatedPageCount; }).reduce((pre, cur) => { return pre + cur; });

    this.emails = emails.map((email) => { return email._id; });
    return this.save();
  });
};

CompilationSchema.methods.updatePages = function updatePages() {
  return Page.find({ _compilation: this._id })
  .select('_id estimatedPageCount')
  .then((pages) => {
    this.pages = pages.map((page) => { return page._id; });
    this.metaData.estimatedPagePdfPages = pages.map((p) => { return p.estimatedPageCount; }).reduce((pre, cur) => { return pre + cur; });
    return this.save();
  });
};

CompilationSchema.methods.buildCoverPdf = function buildCoverPdf(statusCb) {
  return this.buildCoverHtml()
  .then(() => { return this.save(); })
  .then(() => {
    return startWorker({ compilationId: this._id, kind: 'compilation-cover-pdf' }, statusCb);
  });
};

CompilationSchema.methods.updateCoverDimentions = function getCoverDimentions() {
  const template = new covers.Default({ compilation: this });
  const dimentions = template.getCoverDimentions();

  this.cover.height = dimentions.height;
  this.cover.width = dimentions.width;
  return Promise.resolve(this);
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
      }).catch((err) => { console.log('An error happened when seeding the pages', err); });
    }
  });
};

CompilationSchema.methods.buildPdf = function buildPdf(statusCb) {
  statusCb = statusCb || function() {}; // eslint-disable-line

  // return Page.find({ _compilation: this._id, type: { $in: ['table-of-contents', 'title-page'] } })
  // .then((pages) => {
  //   return Promise.all(pages.map((page) => {
  //     return page.save();
  //   }));
  // })
  // .then(() => {
  //   return startWorker({ compilationId: this.id, kind: 'compilation-pages-pdf' }, statusCb);
  // });

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

CompilationSchema.methods.coverPropsChanged = function coverPropsChanged() {
  const original = this._original || {};
  const current = this.toObject();
  const coverProps = [
    'image.updatedAt',
    'title',
    'subtitle',
    'emails',
    'metaData.startingDate',
    'metaData.endingDate',
  ];

  _.some(coverProps, (prop) => { return !_.isEqual(_.get(current, prop), _.get(original, prop)); });
};

export default Mongoose.model('Compilation', CompilationSchema);
