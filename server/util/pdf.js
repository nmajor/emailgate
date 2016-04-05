import pdf from 'html-pdf';
import Email from '../models/email';
import Page from '../models/page';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import stream from 'stream';
import * as sharedHelpers from '../../shared/helpers';
import { emailPageMap } from '../util/helpers';

import * as emailTemplate from '../../shared/templates/email';
import CoverTemplate from '../../shared/templates/cover';
import TitlePageTemplate from '../../shared/templates/titlePage';
import MessagePageTemplate from '../../shared/templates/messagePage';
import TableOfContentsTemplate from '../../shared/templates/tableOfContents';

function pageTemplateFactory(page) {
  return new Promise((resolve) => {
    switch (page.type) {
      case 'cover' :
        return resolve(new CoverTemplate(page));
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
          emailPageMap(page._compilation)
          .then((pageMap) => {
            return resolve(new TableOfContentsTemplate(page, { emails: sortedEmails, pageMap }));
          });
        });
      default :
        return resolve(null);
    }
  });
}

function emailOptions() {
  return {
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
}

export function emailPdfToBuffer(email) {
  return new Promise((resolve) => {
    const html = emailTemplate.toString(email);
    const options = emailOptions();

    return pdf.create(html, options).toBuffer((err, buffer) => {
      resolve(buffer);
    });
  });
}

export function emailPdf(email) {
  const html = emailTemplate.toString(email);
  const options = emailOptions();

  const emailPdfStream = stream.PassThrough(); // eslint-disable-line new-cap

  pdf.create(html, options).toStream((err, pdfStream) => {
    pdfStream.pipe(emailPdfStream);
  });

  return emailPdfStream;
}

export function pagePdf(page) {
  const pagePdfStream = stream.PassThrough(); // eslint-disable-line new-cap

  pageTemplateFactory(page)
  .then((template) => {
    const html = template.toString();

    const options = {
      height: '10.5in',
      width: '8in',
    };

    if (page.type !== 'cover') {
      options.border = {
        top: '0.6in',
        right: '0.6in',
        bottom: '0.6in',
        left: '0.6in',
      };
    }

    pdf.create(html, options).toStream((err, pdfStream) => {
      pdfStream.pipe(pagePdfStream);
    });
  });

  return pagePdfStream;
}

function emailFid(email) { return `e${email._id}`; }
function pageFid(page) { return `p${page._id}`; }

function compilationBasePath(compilationId) {
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

    const wstream = fs.createWriteStream(fsPath, { flags: 'w' });
    emailPdf(email).pipe(wstream);
    wstream.on('finish', () => { return resolve(); });
  });
}

function writePagePdfToFs(page) {
  return new Promise((resolve) => {
    const fsPath = pagePath(page);

    const wstream = fs.createWriteStream(fsPath, { flags: 'w' });
    pagePdf(page).pipe(wstream);
    wstream.on('finish', () => { return resolve(); });
  });
}

export function compilationPdf(compilation) {
  const compilationPdfStream = stream.PassThrough(); // eslint-disable-line new-cap

  const fsPath = compilationBasePath(compilation._id);

  if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp'); }
  if (!fs.existsSync(fsPath)) { fs.mkdirSync(fsPath); }

  Promise.all([
    Email.find({ _compilation: compilation._id }),
    Page.find({ _compilation: compilation._id }),
  ]).then((values) => {
    const [emails, pages] = values;

    return Promise.all([...emails.map(writeEmailPdfToFs), ...pages.map(writePagePdfToFs)])
    .then(() => {
      const sortedPages = sharedHelpers.sortedPages(pages);
      const sortedEmails = sharedHelpers.sortedEmails(emails);

      const pageFileArguments = _.map(sortedPages, (page) => { return pagePath(page); });
      const emailFileArguments = _.map(sortedEmails, (email) => { return emailPath(email); });

      console.log([
        ...pageFileArguments,
        ...emailFileArguments,
        'cat',
        'output',
        '-',
      ]);

      const spawn = require('child_process').spawn;
      const pdftk = spawn('pdftk', [
        ...pageFileArguments,
        ...emailFileArguments,
        'cat',
        'output',
        '-',
      ]);

      // pdftk.stdout.on('data', (data) => {
      //   console.log(`stdout ${data.length}`);
      // });

      pdftk.stdout.pipe(compilationPdfStream);

      pdftk.stderr.on('data', (data) => {
        console.log(`error happened ${data.toString('utf8')}`);
      });

      // pdftk.on('close', (code) => {
      //   console.log(`pdftk process exited with code ${code}`);
      // });
    });
  });

  return compilationPdfStream;
}
