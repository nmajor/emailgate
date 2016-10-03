require('dotenv').config({ silent: true });
import _ from 'lodash';
import assert from 'assert';
// import Email from '../models/email';
// import Page from '../models/page';
//
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

const docker = getDockerObject();

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

function parseStreamChunk(chunk, cb) {
  const logEntryString = chunk.toString('utf8');
  if (logEntryString.indexOf('}{') > -1) {
    try {
      const logEntryArrayString = `[${logEntryString.replace(/\}\{/g, '},{')}]`;
      const entryArray = JSON.parse(logEntryArrayString);

      _.forEach(entryArray, (entry) => {
        cb(entry);
      });
    } catch (e) {
      console.log(e);
      console.log(logEntryString);
    }
  } else {
    try {
      const entry = JSON.parse(logEntryString);
      cb(entry);
    } catch (e) {
      console.log(e);
      console.log(logEntryString);
    }
  }
}

function attachToContainer(container, updateCb, resolve) {
  container.attach({ stream: true, stdout: true }, (err, stream) => { // eslint-disable-line no-shadow
    assert.equal(err, null);

    const streamCleanser = require('docker-stream-cleanser')(); // eslint-disable-line global-require

    const cleanStream = stream.pipe(streamCleanser);
    cleanStream.on('data', (chunk) => {
      parseStreamChunk(chunk, updateCb);
    });

    cleanStream.on('error', (chunk) => {
      console.log(`An error happened in the stream ${chunk.toString()}`);
    });

    cleanStream.on('end', () => {
      container.stop(() => {
        container.remove(() => {
          updateCb({
            type: 'status',
            message: 'Container stopped and removed.',
          });
          resolve();
        });
      });
    });

    container.start((err) => { // eslint-disable-line no-shadow
      assert.equal(err, null);
    });
  });
}

function encodeTask(task) {
  return new Buffer(JSON.stringify(task)).toString('base64');
}

function getDockerConfig(env, task) {
  if (process.env.DOCKER_CONFIG) {
    const dockerConfig = JSON.parse(process.env.DOCKER_CONFIG);
    const config = {
      Image: dockerConfig.Image,
      name: `${dockerConfig.ImageNamePrefix}-${task.id}-${Date.now()}`,
      Env: env,
      HostConfig: dockerConfig.HostConfig,
      AttachStdout: true,
      AttachStderr: true,
      Labels: { taskId: task.id, compilationId: task.props.compilationId },
    };

    return config;
  }

  return {
    Image: 'emailgate-worker',
    name: `emailgate-worker-${task.id}-${Date.now()}`,
    Env: env,
    AttachStdout: true,
    AttachStderr: true,
    Labels: { taskId: task.id, compilationId: task.props.compilationId },
  };
}

function createContainer(env, task, updateCb) {
  return new Promise((resolve) => {
    env.push(`TASK=${encodeTask(task)}`);

    updateCb({
      type: 'status',
      message: 'Creating worker container.',
    });

    docker.createContainer(getDockerConfig(env, task), (err, container) => {
      assert.equal(err, null);

      attachToContainer(container, updateCb, resolve);
    });
  });
}

function startWorker(env, task, updateCb) {
  if (undefined === 1) {
    const containerConfig = getDockerConfig(env, task);

    pullImage(containerConfig.Image)
    .then(() => {
      return createContainer(env, task, updateCb);
    });
  }
}

startWorker();
