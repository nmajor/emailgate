require('dotenv').config({ silent: true });
import _ from 'lodash';
import assert from 'assert';
import Email from '../models/email';
import Page from '../models/page';

import * as sharedHelpers from '../../shared/helpers';
import * as serverHelpers from './helpers';
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

function emailPdfNeedsToBeUpdated(email) {
  if (!email.pdf || !email.pdf.updatedAt) {
    return true;
  } else if (email.updateAt > email.pdf.updatedAt) {
    return true;
  }

  return false;
}

function getEmailIdsNeedingPdf(compilation) {
  return Email.find({ _compilation: compilation._id })
  .then((emails) => {
    const filteredEmails = _.filter(emails, emailPdfNeedsToBeUpdated);
    const emailIds = filteredEmails.map((email) => { return email._id; });
    return Promise.resolve(emailIds);
  });
}

function getEmailPositionMap(compilation) {
  return Email.find({ _compilation: compilation._id })
  .then((emails) => {
    const sortedEmails = sharedHelpers.sortedEmails(emails);
    const positionMap = {};
    _.forEach(sortedEmails, (email, index) => {
      positionMap[email._id] = index;
    });
    return Promise.resolve(positionMap);
  });
}

function getEmailPageMap(compilation) {
  return serverHelpers.emailPageMap(compilation._id);
}

function pageHtmlNeedsToBeUpdated(page) {
  if (page.type === 'table-of-contents') {
    return true;
  } else if (!page.html) {
    return true;
  }

  return false;
}

function pagePdfNeedsToBeUpdated(page) {
  if (!page.pdf || !page.pdf.updatedAt) {
    return true;
  } else if (page.updateAt > page.pdf.updatedAt) {
    return true;
  }

  return false;
}

function getPagePositionMap(compilation) {
  return Page.find({ _compilation: compilation._id })
  .then((pages) => {
    const sortedPages = sharedHelpers.sortedPages(pages);
    const positionMap = {};
    _.forEach(sortedPages, (page, index) => {
      positionMap[page._id] = index;
    });
    return Promise.resolve(positionMap);
  });
}

function getPageIdsNeedingPdf(compilation) {
  return Page.find({ _compilation: compilation._id })
  .then((pages) => {
    return Promise.all(pages.map((page) => {
      if (pageHtmlNeedsToBeUpdated(page)) {
        return page.save();
      }

      return Promise.resolve(page);
    }));
  })
  .then((pages) => {
    const filteredPages = _.filter(pages, pagePdfNeedsToBeUpdated);
    const pageIds = filteredPages.map((page) => { return page._id; });
    return Promise.resolve(pageIds);
  });
}

function getEnv(props) {
  return new Promise((resolve) => {
    const publicPath = process.env.NODE_ENV !== 'production' ? `${process.env.MANTA_APP_PUBLIC_PATH}/dev` : process.env.MANTA_APP_PUBLIC_PATH;
    const Env = [
      `NODE_ENV=${process.env.NODE_ENV}`,
      `COMPILATION_ID=${props.compilation._id}`,
      `MANTA_APP_KEY=${process.env.MANTA_APP_KEY}`,
      `MANTA_APP_KEY_ID=${process.env.MANTA_APP_KEY_ID}`,
      `MANTA_APP_USER=${process.env.MANTA_APP_USER}`,
      `MANTA_APP_USER_ID=${process.env.MANTA_APP_USER_ID}`,
      `MANTA_APP_URL=${process.env.MANTA_APP_URL}`,
      `MANTA_APP_PUBLIC_PATH=${publicPath}`,
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

    const streamCleanser = require('docker-stream-cleanser')();

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

function startWorker(env, task, updateCb) {
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

export function buildEmailPdfs(compilation, socket, cb) {
  return Promise.all([
    getEmailIdsNeedingPdf(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    const [emailIds, env] = results;

    if (emailIds.length === 0) { return Promise.resolve(); }

    const task = {
      name: 'build-email-pdfs',
      id: `${compilation._id}-build-email-pdfs`,
      compilationId: compilation._id,
      props: {
        emailIds,
        compilationId: compilation._id,
      },
    };

    return startWorker(env, task, cb);
  })
  .then(() => {
    return Promise.resolve(compilation);
  });
}

export function buildPagePdfs(compilation, socket, cb) {
  return Promise.all([
    getPageIdsNeedingPdf(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    if (!socket.connected) { return Promise.resolve(compilation); }

    const [pageIds, env] = results;

    if (pageIds.length === 0) { return Promise.resolve(); }

    const task = {
      name: 'build-page-pdfs',
      id: `${compilation._id}-build-page-pdfs`,
      props: {
        pageIds,
        compilationId: compilation._id,
      },
    };

    return startWorker(env, task, cb);
  })
  .then(() => {
    return Promise.resolve(compilation);
  });
}

export function compileCompilationPdfs(compilation, socket, cb) {
  return Promise.all([
    getEmailPositionMap(compilation),
    getEmailPageMap(compilation),
    getPagePositionMap(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    if (!socket.connected) { return Promise.resolve(compilation); }

    const [emailPositionMap, emailPageMap, pagePositionMap, env] = results;
    const task = {
      name: 'build-compilation-pdf',
      id: `${compilation._id}-build-compilation-pdf`,
      props: {
        compilationId: compilation._id,
        emailPositionMap,
        emailPageMap,
        pagePositionMap,
      },
    };

    return startWorker(env, task, cb);
  })
  .then(() => {
    return Promise.resolve(compilation);
  });
}

export function buildCompilationPdf(compilation, socket, cb) {
  return buildEmailPdfs(compilation, socket, cb)
  .then(() => {
    if (!socket.connected) { return Promise.resolve(compilation); }

    return buildPagePdfs(compilation, socket, cb);
  })
  .then(() => {
    if (!socket.connected) { return Promise.resolve(compilation); }

    return compileCompilationPdfs(compilation, socket, cb);
  })
  .then(() => {
    if (!socket.connected) { return Promise.resolve(compilation); }

    return Promise.resolve(compilation);
  });
}
