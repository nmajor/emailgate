import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
// import { emailPdfToBuffer } from '../util/pdf';
// import pdfjs from 'pdfjs-dist';
import EmailTemplate from '../../shared/templates/email';
import queue from '../queue';
import _ from 'lodash';
import { findJobs, getJob, getJobPosition } from '../util/jobs';

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

EmailSchema.methods.needsNewPdf = function needsNewPdf() {
  if (!this.pdf || !this.pdf.updatedAt || !this.pdf.modelVersion) { return Promise.resolve(true); }
  if (this.updatedAt > this.pdf.modelVersion) { return Promise.resolve(true); }
  return Promise.resolve(false);
};

EmailSchema.methods.findOrSchedulePdfJob = function findOrSchedulePdfJob() {
  return findJobs(`email ${this._id}`)
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

EmailSchema.methods.schedulePdfJob = function schedulePdfJob() {
  queue.create('worker', {
    title: `Building pdf file for email ${this._id}`,
    kind: 'email-pdf',
    referenceModel: 'email',
    referenceId: this._id,
  })
  .priority('medium')
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
