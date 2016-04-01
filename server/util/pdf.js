import pdf from 'html-pdf';
import Email from '../models/email';
import Page from '../models/page';
import fs from 'fs';
import _ from 'lodash';

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

function writeEmailPdfToFs(email) {
  return new Promise((resolve) => {
    const emailPath = `tmp/compilation_${email._compilation}/email_${email._id}.pdf`;

    emailPdf(email)
    .then((emailStream) => {
      console.log(`blah START email ${email._id}`);
      const wstream = fs.createWriteStream(emailPath, { flags: 'w' });
      emailStream.pipe(wstream);
      wstream.on('finish', () => { console.log(`blah END email ${email._id}`); return resolve(); });
    });
  });
}

function writePagePdfToFs(page) {
  return new Promise((resolve) => {
    const pagePath = `tmp/compilation_${page._compilation}/page_${page._id}.pdf`;

    pagePdf(page)
    .then((pageStream) => {
      console.log(`blah START page ${page._id}`);
      const wstream = fs.createWriteStream(pagePath, { flags: 'w' });
      pageStream.pipe(wstream);
      wstream.on('finish', () => { console.log(`blah END page ${page._id}`); return resolve(); });
    });
  });
}

export function compilationPdf(compilation) {
  console.log('blah compilationPdf');

  const path = `tmp/compilation_${compilation._id}`;

  if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp'); }
  if (!fs.existsSync(path)) { fs.mkdirSync(path); }

  const emailFsPromises = Email.find({ _compilation: compilation._id })
  .then(emails => Promise.all(emails.map(writeEmailPdfToFs)));

  const pageFsPromises = Page.find({ _compilation: compilation._id })
  .then(pages => Promise.all(pages.map(writePagePdfToFs)));

  Promise.all([emailFsPromises, pageFsPromises])
  .then(() => {
    console.log('email and page files should be done');
  });
}
