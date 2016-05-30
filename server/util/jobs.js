import queue from '../queue';
import { kue } from '../queue';
import reds from 'reds';

let search;
function getSearch() {
  if (search) { return search; }
  reds.createClient = kue.redis.createClient;
  search = reds.createSearch(kue.Job.client.getKey('search'));

  return search;
}

export function slimJob(fullJob) {
  const job = fullJob.toJSON();
  job.position = fullJob.position;

  return job;
}

export function getJob(jobId) {
  return new Promise((resolve) => {
    if (typeof(jobId) === 'object') {
      jobId = jobId.id; // eslint-disable-line no-param-reassign
    }

    kue.Job.get(jobId, (err, updatedJob) => {
      if (err) { return resolve(); }

      resolve(updatedJob);
    });
  });
}

export function getJobPosition(jobId) {
  return new Promise((resolve) => {
    if (typeof(jobId) === 'object') {
      jobId = jobId.id; // eslint-disable-line no-param-reassign
    }

    queue.inactive((err, ids) => {
      ids = ids.sort((a, b) => { return a - b; }); // eslint-disable-line no-param-reassign
      const position = ids.indexOf(parseInt(jobId, 10)) + 1;
      resolve(position);
    });
  });
}

export function getJobWithPosition(job) {
  return Promise.all([
    getJob(job.id),
    getJobPosition(job.id),
  ])
  .then((results) => {
    const [updatedJob, position] = results;
    updatedJob.position = position;

    return Promise.resolve(updatedJob);
  });
}

function watchEventCb(job, cb) {
  return getJobWithPosition(job) // eslint-disable-line
  .then((updatedJob) => {
    cb(updatedJob); // eslint-disable-line
  });
}

export function watchJob(job, cb) {
  const eventCb = watchEventCb.bind(null, job, cb);

  queue.on('job start', eventCb)
  .on('job failed', eventCb)
  .on('job complete', eventCb);

  job.on('progress', eventCb);

  return function unwatchJob() {
    queue.removeListener('job start', eventCb);
    queue.removeListener('job failed', eventCb);
    queue.removeListener('job complete', eventCb);

    job.removeListener('progress', eventCb);
  };
}

export function findJobs(query) {
  return new Promise((resolve, reject) => {
    getSearch().query(query).end((err, ids) => {
      if (err) { return reject(err); }

      resolve(ids);
    });
  });
}
