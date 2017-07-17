import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import io from '../io';
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
  templateConfig: {},
  meta: {},
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
  images: [],
  cover: { type: CompilationCoverSchema, default: {} },
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
  meta: {
    startingDate: { type: Date, default: new Date },
    endingDate: { type: Date, default: new Date },
    estimatedEmailPdfPages: Number,
    estimatedPagePdfPages: Number,
  },
  pdf: {},
}, {
  timestamps: true,
});

CompilationSchema.virtual('newImages').get(function () { // eslint-disable-line func-names
  return this._newImages || [];
});

CompilationSchema.virtual('newImages').set(function (val) { // eslint-disable-line func-names
  this._newImages = val;
  return;
});

CompilationSchema.post('init', function () {  // eslint-disable-line func-names
  this._original = this.toObject();
});

// CompilationSchema.post('save', (doc) => {
//   io.to('everyone').emit('UPDATED_COMPILATION', { title: 'Bogus title' });
//   // io.broadcast.to('priv/John').emit(...)
// });

CompilationSchema.pre('save', function (next) { // eslint-disable-line func-names
  let tasks = Promise.resolve();

  if (this.newImages.length > 0) {
    _.forEach(this.newImages, (image) => {
      const imageId = shortid.generate();
      image._id = imageId;

      tasks = tasks.then(() => {
        image._compilation = this.id;
        return serverHelpers.processCoverImage(image);
      })
      .then((processedImage) => {
        return serverHelpers.uploadCoverImage(processedImage);
      })
      .then((uploadedImage) => {
        this.images.push(uploadedImage);
        return Promise.resolve(this);
      })
      .then(() => {
        this.newImages = [];
      });
    });
  }

  tasks.then(() => {
    next();
  })
  .catch((err) => { console.log('an error happened compilation pre save', err); });
});

CompilationSchema.post('remove', function (doc) { // eslint-disable-line
  Page.remove({ _compilation: doc._id });
  Email.remove({ _compilation: doc._id });

  serverHelpers.removeDir(doc.publicFolderBase());

  if (_.get(doc, 'pdf.path')) {
    serverHelpers.removeFile(doc.pdf.path);
  }

  if (_.get(doc, 'cover.pdf.path')) {
    serverHelpers.removeFile(doc.cover.pdf.path);
  }
});

CompilationSchema.methods.publicFolderBase = function publicFolderBase() {
  if (_.get(this, 'pdf.path')) {
    const regex = new RegExp(`^.*${this._id}`);
    return regex.exec(this.pdf.path)[0];
  } else if (_.get(this, 'pdf.path')) {
    const regex = new RegExp(`^.*${this._id}`);
    return regex.exec(this.pdf.path)[0];
  }

  const publicPath = (process.env.NODE_ENV !== 'production' ? `${process.env.MANTA_APP_PUBLIC_PATH}/dev` : process.env.MANTA_APP_PUBLIC_PATH);
  return `${publicPath}/compilations/${this._id}`;
};

CompilationSchema.methods.buildThumbnail = function buildThumbnail() {
  const thumbnailOptions = {
    type: 'png',             // allowed file types: png, jpeg, pdf
    quality: '75',
    height: 666,        // Dont change height/width, this option doesnt seem to work so
    width: 419,         // this is what it naturally is. Using it to trim below.
  };

  const startDate = this.meta.startingDate;
  const endDate = this.meta.endingDate;

  const template = new covers[this.coverTemplate]({ compilation: this, bleedType: 'bleedless', startDate, endDate });

  return htmlToPdf(template.frontCoverToString(), thumbnailOptions)
  .then((imgBuffer) => {
    const image = {
      content: imgBuffer.toString('base64'),
      contentType: 'image/png',
      updatedAt: Date.now(),
      _compilation: this._id,
    };
    return Promise.resolve(image);
  })
  .then((image) => {
    return serverHelpers.extractImage(image, {
      top: 0,
      left: 0,
      height: thumbnailOptions.height,
      width: thumbnailOptions.width,
    });
  })
  .then((image) => {
    return serverHelpers.uploadCoverThumbnailImage(image);
  })
  .then((image) => {
    this.thumbnail = image;
    return Promise.resolve(this);
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
    this.meta.startingDate = firstEmail.date;
    this.meta.endingDate = lastEmail.date;

    const startDate = this.meta.startingDate;
    const endDate = this.meta.endingDate;

    const template = new covers[this.coverTemplate]({ compilation: this, startDate, endDate });

    this.cover.html = template.toString();
  });
};

CompilationSchema.methods.updateEmails = function updateEmails() {
  return Email.find({ _compilation: this._id })
  .select('_id date estimatedPageCount')
  .then((emails) => {
    const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
    this.meta.startindDate = (sortedEmails[0] || {}).date;
    this.meta.endingDate = (sortedEmails[(sortedEmails.length - 1)] || {}).date;
    this.meta.estimatedEmailPdfPages = emails.map((e) => { return e.estimatedPageCount; }).reduce((pre, cur) => { return pre + cur; });

    this.emails = emails.map((email) => { return email._id; });
    return this.save();
  });
};

CompilationSchema.methods.updatePages = function updatePages() {
  return Page.find({ _compilation: this._id })
  .select('_id estimatedPageCount')
  .then((pages) => {
    this.pages = pages.map((page) => { return page._id; });
    this.meta.estimatedPagePdfPages = pages.map((p) => { return p.estimatedPageCount; }).reduce((pre, cur) => { return pre + cur; });
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
      let tasks = Promise.resolve();
      _.forEach(Page.defaultPages(), (pageData) => {
        tasks = tasks.then(() => {
          const newPage = new Page(pageData);
          newPage._compilation = this._id;
          return newPage.save();
        });
      });

      tasks = tasks.then(() => {
        this.updatePages();
      });

      return tasks;
    }

    return Promise.resolve();
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
    'meta.startingDate',
    'meta.endingDate',
  ];

  return _.some(coverProps, (prop) => { return !_.isEqual(_.get(current, prop), _.get(original, prop)); });
};

CompilationSchema.methods.broadcast = function broadcast() {
  io.to(`users/${this._user}`).emit('UPDATED_COMPILATION', this);
};

export default Mongoose.model('Compilation', CompilationSchema);
