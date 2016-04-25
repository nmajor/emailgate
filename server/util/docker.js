require('dotenv').config({ silent: true });
import assert from 'assert';
import Email from '../models/email';

import Docker from 'dockerode';
const docker = new Docker();
// const docker = new Docker({
//   protocol: 'https',
//   host: '192.168.99.100',
//   port: 2376,
//   ca: '/Users/nmajor/.docker/machine/machines/default/ca.pem',
//   cert: '/Users/nmajor/.docker/machine/machines/default/cert.pem',
//   key: '/Users/nmajor/.docker/machine/machines/default/key.pem',
// });

// function generateTask(type, props) {
//   return {
//     type,
//     props,
//   };
// }

function getEmailIdsNeedingPdf(compilation) {
  return Email.find({ _compilation: compilation._id })
  .then((emails) => {
    const emailIds = emails.map((email) => { return email._id; });
    return Promise.resolve(emailIds.slice(0, 20));
  });
}

function getEnv(props) {
  return new Promise((resolve) => {
    const Env = [
      `COMPILATION_ID=${props.compilation._id}`,
      `MANTA_APP_KEY=${process.env.MANTA_APP_KEY}`,
      `MANTA_APP_KEY_ID=${process.env.MANTA_APP_KEY_ID}`,
      `MANTA_APP_USER=${process.env.MANTA_APP_USER}`,
      `MANTA_APP_USER_ID=${process.env.MANTA_APP_USER_ID}`,
      `MANTA_APP_URL=${process.env.MANTA_APP_URL}`,
      `MANTA_APP_PUBLIC_PATH=${process.env.MANTA_APP_PUBLIC_PATH}`,
    ];

    if (process.env.MONGO_URL.indexOf('localhost') > -1) {
      const mongoUrl = process.env.MONGO_URL;

      require('dns').lookup(require('os').hostname(), (err, add) => {
        if (add) {
          Env.push(`MONGO_URL=${mongoUrl.replace('localhost', add)}`);
        } else {
          Env.push(`MONGO_URL=${mongoUrl}`);
        }
        resolve(Env);
      });
    } else {
      Env.push(`MONGO_URL=${process.env.MONGO_URL}`);
      resolve(Env);
    }
  });
}

function encodeTask(task) {
  return new Buffer(JSON.stringify(task)).toString('base64');
}

function startWorker(env, task, compilation, updateCb) {
  return new Promise((resolve, reject) => {
    env.push(`TASK=${encodeTask(task)}`);

    docker.createContainer({
      Image: 'emailgate-pdf',
      name: `emailgate-pdf-${Date.now()}`,
      env,
    }, (err, container) => {
      assert.equal(err, null);

      container.start((err) => { // eslint-disable-line no-shadow
        assert.equal(err, null);

        container.attach({ stream: true, stdout: true }, (err, stream) => { // eslint-disable-line no-shadow
          assert.equal(err, null);

          const streamCleanser = require('docker-stream-cleanser')();

          const cleanStream = stream.pipe(streamCleanser);
          cleanStream.on('data', (chunk) => {
            const logEntryString = chunk.toString();
            const entry = JSON.parse(logEntryString);
            updateCb(entry);
          });

          cleanStream.on('error', () => {
            console.log('An error happened in the stream');
            reject(compilation);
          });

          cleanStream.on('end', () => {
            container.stop(() => {
              container.remove(() => {
                updateCb({
                  type: 'status',
                  message: 'Container stopped and removed.',
                });
                resolve(compilation);
              });
            });
          });
        });
      });
    });
  });
}

export function buildEmailPdfs(compilation, cb) {
  return Promise.all([
    getEmailIdsNeedingPdf(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    const [emailIds, env] = results;
    const task = {
      name: 'build-email-pdfs',
      props: {
        emailIds,
        compilationId: compilation._id,
      },
    };

    return startWorker(env, task, compilation, cb);
  });
}

// export function buildEmailPdfs(compilation, cb) {
//
// }
