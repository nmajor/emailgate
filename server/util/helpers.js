import stream from 'stream';
import moment from 'moment';
import Email from '../models/email';
import * as sharedHelpers from '../../shared/helpers';
import _ from 'lodash';

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

export function processEmails() {
  const transformStream = stream.Transform();  // eslint-disable-line new-cap

  transformStream._transform = (chunk, enc, next) => {
    const email = JSON.parse(chunk.toString('utf8'));

    // mid should be unique to the message not the object
    const mid = email.messageId;

    const processedEmail = {
      date: email.date,
      mid,
      // headers: email.headers,
      to: email.to,
      from: email.from,
      subject: email.subject,
      // messageId: email.messageId,
      // text: email.text,
      body: email.html,
      attachments: email.attachments || [],
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
  const products = require('../products.json');

  return _.find(products, (product) => { return parseInt(product._id, 10) === parseInt(id, 10); });
}
