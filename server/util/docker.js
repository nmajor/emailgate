require('dotenv').config({ silent: true });
import _ from 'lodash';
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
  return new Promise((resolve, reject) => {
    if (image.indexOf('/') > -1) {
      docker.pull(`${image}:latest`, (err, stream) => {
        if (err) { return reject(err); }

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

function attachToContainer(container, statusCb) {
  return new Promise((resolve, reject) => {
    container.attach({ stream: true, stdout: true }, (err, stream) => { // eslint-disable-line no-shadow
      if (err) { return reject(err); }

      statusCb({
        type: 'status',
        message: 'Attaching to container',
      });

      const streamCleanser = require('docker-stream-cleanser')(); // eslint-disable-line global-require

      const cleanStream = stream.pipe(streamCleanser);
      cleanStream.on('data', (chunk) => {
        parseStreamChunk(chunk, statusCb);
      });

      cleanStream.on('error', (chunk) => {
        console.log(`An error happened in the stream ${chunk.toString()}`);
      });

      cleanStream.on('end', () => {
        container.stop(() => {
          container.remove(() => {
            statusCb({
              type: 'status',
              message: 'Container stopped and removed.',
            });
            resolve();
          });
        });
      });

      container.start((err) => { // eslint-disable-line no-shadow
        if (err && err.statusCode !== 304) { return reject(err); }
      });
    });
  });
}

function encodeTask(task) {
  return new Buffer(JSON.stringify(task)).toString('base64');
}

function getDockerConfig(env, task) {
  const containerName = `emailgate-worker-${task.compilationId}`;
  const dockerConfig = JSON.parse(process.env.DOCKER_CONFIG);
  const config = {
    Image: dockerConfig.image,
    name: containerName,
    Env: env,
    HostConfig: { mem_limit: dockerConfig.mem_limit },
    AttachStdout: true,
    AttachStderr: true,
    Labels: { taskKind: task.kind, compilationId: task.compilationId },
  };

  return config;
}

function findContainer(name) {
  console.log(name);
  return new Promise((resolve, reject) => {
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) { return reject(err); }
      const containerInfo = _.find(containers, (info) => { console.log(info.Names); return info.Names.indexOf(`/${name}`) > -1; });

      if (!containerInfo) { return resolve(undefined); }
      const container = docker.getContainer(containerInfo.Id);
      resolve(container);
    });
  });
}

function createContainer(config) {
  return new Promise((resolve, reject) => {
    docker.createContainer(config, (err, container) => { // eslint-disable-line no-shadow
      if (err) { return reject(err); }
      return resolve(container);
    });
  });
}

function findOrCreateContainer(config, task) {
  return new Promise((resolve, reject) => {
    config.Env.push(`TASK=${encodeTask(task)}`);

    findContainer(config.name)
    .then((container) => {
      if (!container) { return resolve(createContainer(config)); }

      if (container) {
        container.inspect((err, info) => {
          if (err) { return reject(err); }

          if (info.State.Running) {
            return resolve(container);
          }

          container.stop(() => {
            container.remove(() => {
              resolve(createContainer(config));
            });
          });
        });
      }
    });
  });
}

function getEnv() {
  return new Promise((resolve) => {
    const publicPath = process.env.NODE_ENV !== 'production' ? `${process.env.MANTA_APP_PUBLIC_PATH}/dev` : process.env.MANTA_APP_PUBLIC_PATH;
    const Env = [
      `NODE_ENV=${process.env.NODE_ENV}`,
      `MANTA_APP_KEY=${process.env.MANTA_APP_KEY}`,
      `MANTA_APP_KEY_ID=${process.env.MANTA_APP_KEY_ID}`,
      `MANTA_APP_USER=${process.env.MANTA_APP_USER}`,
      `MANTA_APP_USER_ID=${process.env.MANTA_APP_USER_ID}`,
      `MANTA_APP_URL=${process.env.MANTA_APP_URL}`,
      `MANTA_APP_PUBLIC_PATH=${publicPath}`,
    ];

    if (process.env.MONGO_URL.indexOf('localhost') > -1) {
      const mongoUrl = process.env.MONGO_URL;

      require('dns').lookup(require('os').hostname(), (err, add) => { // eslint-disable-line global-require
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

export function startWorker(task, statusCb) {
  return getEnv()
  .then((env) => {
    const containerConfig = getDockerConfig(env, task);

    return pullImage(containerConfig.Image)
    .then(() => {
      return findOrCreateContainer(containerConfig, task, statusCb);
    })
    .then((container) => {
      return attachToContainer(container, statusCb);
    });
  });
}
