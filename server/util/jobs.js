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

  return job;
}

export function getJob(jobId) {
  return new Promise((resolve) => {
    kue.Job.get(jobId, (err, updatedJob) => {
      if (err) { return resolve(); }

      resolve(updatedJob);
    });
  });
}

export function watchJob(job, cb) {
  job.on('progress', () => {
    getJob(job.id)
    .then((updatedJob) => {
      cb(updatedJob);
    });
  })
  .on('failed attempt', () => {
    getJob(job.id)
    .then((updatedJob) => {
      cb(updatedJob);
    });
  })
  .on('failed', () => {
    getJob(job.id)
    .then((updatedJob) => {
      cb(updatedJob);
    });
  })
  .on('complete', () => {
    getJob(job.id)
    .then((updatedJob) => {
      cb(updatedJob);
    });
  });
}

export function findJobs(query) {
  return new Promise((resolve, reject) => {
    getSearch().query(query).end((err, ids) => {
      if (err) { return reject(err); }

      resolve(ids);
    });
  });
}
