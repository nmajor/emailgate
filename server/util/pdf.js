import pdf from 'html-pdf';
import Email from '../models/email';
import Page from '../models/page';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import * as sharedHelpers from '../../shared/helpers';

import * as emailTemplate from '../../shared/templates/email';
import TitlePageTemplate from '../../shared/templates/titlePage';
import MessagePageTemplate from '../../shared/templates/messagePage';
import TableOfContentsTemplate from '../../shared/templates/tableOfContents';

function pageTemplateFactory(page) {
  return new Promise((resolve) => {
    switch (page.type) {
      case 'title-page' :
        return Email.find({ _compilation: page._compilation })
        .then((emails) => {
          const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
          const firstEmail = sortedEmails[0] || {};
          const lastEmail = sortedEmails[(sortedEmails.length - 1)] || {};
          const startDate = firstEmail.date;
          const endDate = lastEmail.date;
          return resolve(new TitlePageTemplate(page, { startDate, endDate }));
        });
      case 'message-page' :
        return resolve(new MessagePageTemplate(page));
      case 'table-of-contents' :
        return Email.find({ _compilation: page._compilation })
        .then((emails) => {
          const sortedEmails = _.sortBy(emails, (email) => { return email.date; });
          return resolve(new TableOfContentsTemplate(page, { emails: sortedEmails }));
        });
      default :
        return resolve(null);
    }
  });
}

export function emailPdf(email) {
  return new Promise((resolve) => {
    const html = emailTemplate.toString(email);

    const options = {
      height: '10.5in',
      width: '8in',
      border: {
        top: '0.6in',
        right: '0.6in',
        bottom: '0.6in',
        left: '0.6in',
      },
      footer: {
        height: '0.2in',
        contents: '<div style="font-size: 0.8em; font-family: \'Montserrat\', sans-serif; text-align: center;">{{page}}</div>',
      },
    };

    pdf.create(html, options).toStream((err, stream) => {
      resolve(stream);
    });
  });
}

export function pagePdf(page) {
  return pageTemplateFactory(page)
  .then((template) => {
    return new Promise((resolve) => {
      const html = template.toString();

      const options = {
        height: '10.5in',
        width: '8in',
        border: {
          top: '0.6in',
          right: '0.6in',
          bottom: '0.6in',
          left: '0.6in',
        },
      };

      pdf.create(html, options).toStream((err, stream) => {
        return resolve(stream);
      });
    });
  });
}

function emailFid(email) { return `e${email._id}`; }
function pageFid(page) { return `p${page._id}`; }

function compilationBasePath(compilationId) {
  console.log(path.resolve(__dirname, `../../tmp/compilation_${compilationId}`));
  return path.resolve(__dirname, `../../tmp/compilation_${compilationId}`);
}

function emailPath(email) {
  const basePath = compilationBasePath(email._compilation);
  return `${basePath}/${emailFid(email)}.pdf`;
}

function pagePath(page) {
  const basePath = compilationBasePath(page._compilation);
  return `${basePath}/${pageFid(page)}.pdf`;
}

function writeEmailPdfToFs(email) {
  return new Promise((resolve) => {
    const fsPath = emailPath(email);

    emailPdf(email)
    .then((emailStream) => {
      console.log(`blah START email ${email._id}`);
      const wstream = fs.createWriteStream(fsPath, { flags: 'w' });
      emailStream.pipe(wstream);
      wstream.on('finish', () => { console.log(`blah END email ${email._id}`); return resolve(); });
    });
  });
}

function writePagePdfToFs(page) {
  return new Promise((resolve) => {
    const fsPath = pagePath(page);

    pagePdf(page)
    .then((pageStream) => {
      console.log(`blah START page ${page._id}`);
      const wstream = fs.createWriteStream(fsPath, { flags: 'w' });
      pageStream.pipe(wstream);
      wstream.on('finish', () => { console.log(`blah END page ${page._id}`); return resolve(); });
    });
  });
}

export function compilationPdf(compilation) {
  console.log('blah compilationPdf');

  console.log('blah1');
  const fsPath = compilationBasePath(compilation._id);
  console.log('blah2');

  if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp'); }
  if (!fs.existsSync(fsPath)) { fs.mkdirSync(fsPath); }

  Promise.all([
    Email.find({ _compilation: compilation._id }),
    Page.find({ _compilation: compilation._id }),
  ]).then((values) => {
    const [emails, pages] = values;
    console.log('blah values');
    console.log(`emails ${emails.length}`);
    console.log(`pages ${pages.length}`);

    return Promise.all([...emails.map(writeEmailPdfToFs), ...pages.map(writePagePdfToFs)])
    .then(() => {
      console.log('All files should be created by now');
      const sortedPages = _.sortBy(pages, (page) => { return sharedHelpers.pageMeta(page).position; });
      const sortedEmails = _.sortBy(emails, 'date');

      const pageFileArguments = _.map(sortedPages, (page) => { return pagePath(page); });
      const emailFileArguments = _.map(sortedEmails, (email) => { return emailPath(email); });

      // const sortedPageFids = _.map(sortedPages, (page) => { return pageFid(page); });
      // const sortedEmailFids = _.map(sortedEmails, (email) => { return emailFid(email); });

      console.log([
        ...pageFileArguments,
        ...emailFileArguments,
        'cat',
        'output',
        '-',
      ].join(' '));

      const spawn = require('child_process').spawn;
      const pdftk = spawn('pdftk', [
        ...pageFileArguments,
        ...emailFileArguments,
        'cat',
        'output',
        '-',
      ]);
      // const pdftk = spawn('pdftk', [
      //   ...pageFileArguments,
      //   ...emailFileArguments,
      //   'cat',
      //   ...sortedPageFids,
      //   ...sortedEmailFids,
      //   'output',
      //   '-',
      // ]);

      pdftk.stdout.on('data', (data) => {
        console.log(`stdout ${data.length}`);
      });

      const wstream = fs.createWriteStream(`${fsPath}.pdf`, { flags: 'w' });
      pdftk.stdout.pipe(wstream);

      pdftk.stderr.on('data', (data) => {
        console.log('error happened');
        console.log(data.toString('utf8'));
      });

      pdftk.on('close', (code) => {
        console.log(`pdftk process exited with code ${code}`);
      });
    });
  });

  // Promise.all([emailFsPromises, pageFsPromises])
  // .then(() => {
  //   console.log('email and page files should be done');
  //
    // const spawn = require('child_process').spawn;
    // const pdftk = spawn('pdftk', ['-lh', '/usr']);
    //
    // pdftk.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    //
    // const wstream = fs.createWriteStream(`${path}.pdf`, { flags: 'w' });
    // pdftk.stdout.pipe(wstream);
    //
    // pdftk.on('close', (code) => {
    //   console.log(`pdftk process exited with code ${code}`);
    // });
  // });
}
