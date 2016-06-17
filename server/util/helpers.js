import stream from 'stream';
import moment from 'moment';
import Email from '../models/email';
import * as sharedHelpers from '../../shared/helpers';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';

import CoverTemplate from '../../shared/templates/cover';
import TitlePageTemplate from '../../shared/templates/titlePage';
import MessagePageTemplate from '../../shared/templates/messagePage';
import TableOfContentsTemplate from '../../shared/templates/tableOfContents';

export function imapifyFilter(filter) {
  const imapFilter = ['ALL'];

  if (filter.subject) {
    imapFilter.push(['SUBJECT', filter.subject]);
  }

  if (filter.to) {
    imapFilter.push(['TO', filter.to]);
  }

  if (filter.from) {
    imapFilter.push(['FROM', filter.from]);
  }

  if (filter.startDate) {
    imapFilter.push(['SINCE', moment(filter.startDate).format('LL')]);
  }

  if (filter.endDate) {
    imapFilter.push(['BEFORE', moment(filter.endDate).format('LL')]);
  }

  return imapFilter;
}

export function googlifyFilter(filter) {
  const googleFilter = [];

  if (filter.subject) {
    googleFilter.push(`subject:${filter.subject}`);
  }

  if (filter.to) {
    googleFilter.push(`to:${filter.to}`);
  }

  if (filter.from) {
    googleFilter.push(`from:${filter.from}`);
  }

  if (filter.startDate) {
    googleFilter.push(`after:${moment(filter.startDate).format('YYYY/MM/DD')}`);
  }

  if (filter.endDate) {
    googleFilter.push(`before:${moment(filter.endDate).format('YYYY/MM/DD')}`);
  }

  return googleFilter.join(' ');
}

export function sanitizeEmailBody(text) {
  return sanitizeHtml(text, {
    allowedTags: [
      'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
    ],
    allowedAttributes: {
      a: [],
    },
  });
}

export function filteredAttachments(attachments) {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
  ];

  return _.filter(attachments, (a) => {
    return allowedTypes.indexOf(a.contentType) > -1;
  });
}

export function processAttachments(attachments) {
  return filteredAttachments(attachments).map((a) => {
    return {
      contentType: a.contentType,
      fileName: a.fileName,
      contentDisposition: a.contentDisposition,
      contentId: a.contentId,
      checksum: a.checksum,
      length: a.length,
      content: a.content,
    };
  });
}

export function processEmails() {
  const transformStream = stream.Transform();  // eslint-disable-line new-cap

  transformStream._transform = (chunk, enc, next) => {
    const email = JSON.parse(chunk.toString('utf8'));

    // mid should be unique to the message not the object
    const mid = email.messageId;

    const attachments = email.attachments ? processAttachments(email.attachments) : [];
    if (attachments.length > 0) { console.log(attachments); }

    const processedEmail = {
      date: email.date,
      mid,
      // headers: email.headers,
      to: email.to,
      from: email.from,
      subject: email.subject,
      // messageId: email.messageId,
      // text: email.text,
      body: sanitizeEmailBody(email.html),
      attachments,
    };

    transformStream.push(new Buffer(JSON.stringify(processedEmail)));
    next();
  };

  return transformStream;
}

export function emailPageMap(compilationId) {
  return new Promise((resolve) => {
    Email.find({ _compilation: compilationId })
    .then((emails) => {
      resolve(sharedHelpers.emailPageMap(emails));
    });
  });
}

export function processPdf(pdfObj) {
  const processedPdf = {
    pageCount: pdfObj.pageCount,
    url: pdfObj.url,
    filename: pdfObj.filename,
    updatedAt: pdfObj.updatedAt,
    path: pdfObj.path,
    extension: pdfObj.extension,
    type: pdfObj.type,
    etag: pdfObj.etag,
    md5: pdfObj.md5,
    size: pdfObj.size,
  };

  return processedPdf;
}

export function getProductById(id) {
  const products = require('../products.json'); // eslint-disable-line global-require

  return _.find(products, (product) => { return parseInt(product._id, 10) === parseInt(id, 10); });
}

export function pageTemplateFactory(page) {
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
