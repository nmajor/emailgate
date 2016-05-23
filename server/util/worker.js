require('dotenv').config({ silent: true });
import _ from 'lodash';
import assert from 'assert';
// import Email from '../models/email';
// import Page from '../models/page';

// import * as sharedHelpers from '../../shared/helpers';
// import * as serverHelpers from './helpers';
import Docker from 'dockerode';

function getDockerObject() {
  if (process.env.NODE_ENV === 'production') {
    return new Docker({
      port: process.env.DOCKER_PORT,
      host: process.env.DOCKER_HOST,
      ca: (new Buffer(process.env.DOCKER_CA, 'base64').toString('utf8')),
      cert: (new Buffer(process.env.DOCKER_CERT, 'base64').toString('utf8')),
      key: (new Buffer(process.env.DOCKER_KEY, 'base64').toString('utf8')),
    });
  }

  return new Docker();
}

function getWorkerConfig() {
  return {
    Image: process.env.WORKER_IMAGE,
    name: `emailgate-worker-${Date.now()}`,
    HostConfig: { Memory: 4096 },
    Labels: { type: 'emailgate-worker' },
  };
}

const docker = getDockerObject();
const workerConfig = getWorkerConfig();

function createContainer() {
  return new Promise((resolve) => {
    docker.createContainer(workerConfig, (err, container) => {
      assert.equal(err, null);

      resolve(container);
    });
  });
}

function pullImage(image) {
  return new Promise((resolve) => {
    if (image.indexOf('/') > -1) {
      docker.pull(`${image}:latest`, (err, stream) => {
        assert.equal(err, null);

        stream.on('error', (err) => { // eslint-disable-line no-shadow
          console.log(`An error happened ${err.message}`);
        });

        stream.on('end', () => {
          resolve();
        });
        // streaming output from pull...
      });
    } else {
      resolve();
    }
  });
}

// function stopWorker(containerId) {
//   return new Promise((resolve) => {
//     docker.getContainer(containerId).stop((err) => {
//       assert.equal(err, null);
//
//       resolve();
//     });
//   });
// }

function findWorkers() {
  return new Promise((resolve) => {
    docker.listContainers((err, containers) => {
      assert.equal(err, null);

      const filteredContainers = _.find(containers, (containerInfo) => {
        return containerInfo.Labels['com.docker.compose.service'] === 'emailgate-worker';
      });

      resolve(filteredContainers);
    });
  });
}

export function startWorker() {
  pullImage(workerConfig.Image)
  .then(() => {
    return createContainer();
  });
}

export default function () {
  findWorkers();
}
