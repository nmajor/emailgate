import { kue } from '../queue';

function slimJob(fullJob) {
  const job = fullJob.toJSON();

  return job;
}

function getJob(jobId) {
  return new Promise((resolve, reject) => {
    kue.Job.get(jobId, (err, updatedJob) => {
      if (err) { return reject(err); }

      resolve(updatedJob);
    });
  });
}

function getTrimJob(job) {
  return getJob(job.id)
  .then((updatedJob) => {
    return Promise.resolve(slimJob(updatedJob));
  });
}

export function watchJob(job, cb) {
  job.on('progress', () => {
    getTrimJob(job)
    .then((slimedJob) => {
      cb(slimedJob);
    });
  });
}
