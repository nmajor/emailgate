require('dotenv').config({ silent: true });
import _ from 'lodash';
import assert from 'assert';
import Email from '../models/email';
import Page from '../models/page';

import * as sharedHelpers from '../../shared/helpers';
import * as serverHelpers from './helpers';
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

function emailPdfNeedsToBeUpdated(email) {
  if (email) {
    return true;
  }

  return true;
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
  if (page) {
    return true;
  }

  return true;
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

function startWorker(env, task, updateCb) {
  return new Promise((resolve, reject) => {
    console.log(`${task.name} TASK=${encodeTask(task)}`);
    env.push(`TASK=${encodeTask(task)}`);

    docker.createContainer({
      Image: 'emailgate-worker',
      name: `emailgate-worker-${Date.now()}`,
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
            reject();
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

    if (emailIds.length === 0) { return Promise.resolve(); }

    const task = {
      name: 'build-email-pdfs',
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

export function buildPagePdfs(compilation, cb) {
  return Promise.all([
    getPageIdsNeedingPdf(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    const [pageIds, env] = results;

    if (pageIds.length === 0) { return Promise.resolve(); }

    const task = {
      name: 'build-page-pdfs',
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

export function compileCompilationPdfs(compilation, cb) {
  return Promise.all([
    getEmailPositionMap(compilation),
    getEmailPageMap(compilation),
    getPagePositionMap(compilation),
    getEnv({ compilation }),
  ])
  .then((results) => {
    const [emailPositionMap, emailPageMap, pagePositionMap, env] = results;
    const task = {
      name: 'build-compilation-pdf',
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

export function buildCompilationPdf(compilation, cb) {
  return buildEmailPdfs(compilation, cb)
  .then(() => {
    return buildPagePdfs(compilation, cb);
  })
  .then(() => {
    return compileCompilationPdfs(compilation, cb);
  })
  .then(() => {
    return Promise.resolve(compilation);
  });
}
