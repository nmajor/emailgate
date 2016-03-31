import pdf from 'html-pdf';
import Email from '../models/email';

import * as emailTemplate from '../../shared/templates/email';
import TitlePageTemplate from '../../shared/templates/titlePage';
import MessagePageTemplate from '../../shared/templates/messagePage';
import TableOfContentsTemplate from '../../shared/templates/tableOfContents';

import _ from 'lodash';

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
        return resolve(new TableOfContentsTemplate(page));
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
