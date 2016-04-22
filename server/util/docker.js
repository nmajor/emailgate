require('dotenv').config({ silent: true });
import assert from 'assert';

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

function getEnv() {
  return new Promise((resolve) => {
    const Env = [
      `COMPILATION_ID=${process.env.COMPILATION_ID}`,
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

// function handleStreamLog(log, cb) {
//   console.log(log);
// }
//
// function matchCbToLog(log) {
//
// }

export function generateEmailPdfs() {
  return getEnv()
  .then((env) => {
    return new Promise((resolve, reject) => {
      docker.createContainer({
        Image: 'emailgate-pdf',
        name: `emailgate-pdf-${Date.now()}`,
        env,
      }, (err, container) => {
        assert.equal(err, null);

        container.start((err) => { // eslint-disable-line no-shadow
          assert.equal(err, null);

          container.attach({ stream: true, stdout: true, stderr: true }, (err, stream) => { // eslint-disable-line no-shadow
            assert.equal(err, null);

            stream.on('data', (chunk) => {
              const log = chunk.toString('utf8');
              console.log(log);
              // matchCbToLog(log, cbs);
            });

            stream.on('end', () => {
              container.stop(() => {
                container.remove(() => {
                  resolve();
                });
              });
            });

            stream.on('error', (err) => { // eslint-disable-line no-shadow
              reject(err);
            });
          });
        });
      });
    });
  });
}
