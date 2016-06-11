import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import _ from 'lodash';
import Email from './email';
// import { pageHtml } from '../util/pdf';
import { pageTemplateFactory } from '../util/helpers';
import { lastPdfUpdatedAt } from '../../shared/helpers';
import queue from '../queue';
import { findJobs, getJob, getJobPosition } from '../util/jobs';

const PageSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _compilation: { type: String, ref: 'Compilation' },
  type: String,
  content: {},
  html: String,
  pdf: {},
}, {
  timestamps: true,
});

PageSchema.statics.defaultPages = function defaultPages() {
  return [
    // { type: 'cover' },
    { type: 'title-page' },
    { type: 'message-page' },
    { type: 'table-of-contents' },
  ];
};

PageSchema.post('init', function () {  // eslint-disable-line func-names
  this._original = this.toObject();
});

PageSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.getHtml()
  .then(() => {
    console.log('blah hey page pre save');
    console.log(this.propChanged('html'));
    if (this.propChanged('html')) {
      return this.findOrSchedulePdfJob();
    }

    return Promise.resolve(this);
  })
  .then(() => {
    next();
  });
});

PageSchema.methods.needsNewPdf = function needsNewPdf() {
  if (!this.pdf || !this.pdf.updatedAt || !this.pdf.modelVersion) { return Promise.resolve(true); }
  if (this.updatedAt > this.pdf.modelVersion) { return Promise.resolve(true); }
  if (this.type === 'table-of-contents') {
    return Email.find({ _compilation: this._compilation })
    .then((emails) => {
      if (lastPdfUpdatedAt([], emails) > this.pdf.updatedAt) {
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    });
  }
  return Promise.resolve(false);
};

PageSchema.methods.findOrSchedulePdfJob = function findOrSchedulePdfJob() {
  return findJobs(`page ${this._id}`)
  .then((jobs) => {
    if (jobs.length > 0) {
      return Promise.all([
        getJobPosition(jobs[0]),
        getJob(jobs[0]),
      ])
      .then((results) => {
        const [position, job] = results;

        if (!job) {
          return this.schedulePdfJob();
        } else if (job.state() === 'failed') {
          job.remove();
          return this.schedulePdfJob();
        } else if (job.state() === 'active' && this.updatedAt > job.created_at) {
          job.remove();
          return this.schedulePdfJob();
        }

        job.subscribe(() => {});
        job.position = position;
        return Promise.resolve(job);
      });
    }

    return this.schedulePdfJob();
  });
};

PageSchema.methods.schedulePdfJob = function schedulePdfJob() {
  return queue.create('worker', {
    title: `Building pdf file for page ${this._id}`,
    kind: 'page-pdf',
    referenceModel: 'page',
    referenceId: this._id,
  })
  .priority('medium')
  .searchKeys(['referenceModel', 'referenceId'])
  .removeOnComplete(true)
  .attempts(3)
  .save((err) => {
    if (err) console.log('An error happened adding page-pdf job to queue');
  });
};

PageSchema.methods.getHtml = function getHtml() {
  return pageTemplateFactory(this)
  .then((template) => {
    this.html = template.toString();

    return Promise.resolve(this);
  });
};

PageSchema.methods.propChanged = function propChanged(propsString) {
  const original = this._original || {};
  const current = this.toObject();

  const originalProp = _.get(original, propsString);
  const currentProp = _.get(current, propsString);

  return !_.isEqual(originalProp, currentProp);
};

export default Mongoose.model('Page', PageSchema);
