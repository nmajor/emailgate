import pdf from 'html-pdf';
import Email from '../models/email';
import Page from '../models/page';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import stream from 'stream';
import * as sharedHelpers from '../../shared/helpers';
import { emailPageMap } from '../util/helpers';

import EmailTemplate from '../../shared/templates/email';
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

function emailOptions(pageNumber) {
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
      pageOffset: (pageNumber - 1),
      height: '0.2in',
      contents: '<div style="font-size: 0.8em; font-family: \'Montserrat\', sans-serif; text-align: center;">{{offsetPage}}</div>',
    },
  };
}

export function emailPdfToBuffer(email, pageNumber) {
  return new Promise((resolve) => {
    const template = new EmailTemplate(email, pageNumber);
    const html = template.toString();
    const options = emailOptions(pageNumber);

    return pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        console.log(`Error happened when creating a pdf buffer ${err}`);
      }

      resolve(buffer);
    });
  });
}

export function emailPdf(email, pageNumber) {
  const template = new EmailTemplate(email, pageNumber);
  const html = template.toString();
  const options = emailOptions(pageNumber);

  const emailPdfStream = stream.PassThrough(); // eslint-disable-line new-cap

  pdf.create(html, options).toStream((err, pdfStream) => {
    if (err) {
      console.log(`An error happened when generating the email pdf ${err}`);
      emailPdfStream.end();
      return;
    }

    pdfStream.pipe(emailPdfStream);
  });

  return emailPdfStream;
}

export function pageHtml(page) {
  return pageTemplateFactory(page)
  .then((template) => {
    return Promise.resolve(template.toString());
  });
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
      if (err) {
        console.log(`An error happened when generating the page pdf ${err}`);
        pagePdfStream.end();
        return;
      }

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

function writeEmailPdfToFs(email, pageMap) {
  return new Promise((resolve) => {
    const fsPath = emailPath(email);

    const wstream = fs.createWriteStream(fsPath, { flags: 'w' });
    emailPdf(email, pageMap[email._id]).pipe(wstream);
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
    emailPageMap(compilation._id),
  ]).then((values) => {
    const [emails, pages, pageMap] = values;

    return Promise.all([
      ...emails.map((email) => { return writeEmailPdfToFs(email, pageMap); }),
      ...pages.map(writePagePdfToFs),
    ])
    .then(() => {
      const sortedPages = sharedHelpers.sortedPages(pages);
      const sortedEmails = sharedHelpers.sortedEmails(emails);

      const pageFileArguments = _.map(sortedPages, (page) => { return pagePath(page); });
      const emailFileArguments = _.map(sortedEmails, (email) => { return emailPath(email); });

      const spawn = require('child_process').spawn;
      const pdftk = spawn('pdftk', [
        ...pageFileArguments,
        ...emailFileArguments,
        'cat',
        'output',
        '-',
      ]);

      pdftk.stdout.pipe(compilationPdfStream);

      pdftk.stderr.on('data', (data) => {
        console.log(`error happened ${data.toString('utf8')}`);
      });
    });
  });

  return compilationPdfStream;
}
