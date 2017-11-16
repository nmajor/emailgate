import stream from 'stream';
import moment from 'moment';
import twemoji from 'twemoji';
// import request from 'request';
import Email from '../models/email';
import Compilation from '../models/compilation';
import * as sharedHelpers from '../../shared/helpers';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import sharp from 'sharp';
import manta from 'manta';
import shortid from 'shortid';

import CoverTemplate from '../../shared/templates/cover';
import TitlePageTemplate from '../../shared/templates/titlePage';
import MessagePageTemplate from '../../shared/templates/messagePage';
import TableOfContentsTemplate from '../../shared/templates/tableOfContents';
import FullImagePageTemplate from '../../shared/templates/fullImagePage';

const client = manta.createClient({
  sign: manta.privateKeySigner({
    key: process.env.MANTA_APP_KEY.replace(/\\n/g, '\n'),
    keyId: process.env.MANTA_APP_KEY_ID,
    user: process.env.MANTA_APP_USER,
  }),
  user: process.env.MANTA_APP_USER,
  url: process.env.MANTA_APP_URL,
  connectTimeout: 25000,
});

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
  return filter.q;
}

export function trimKnownBodyFluff(text) {
  if (!text) { return text; }

  return text
  .replace(/NOTICE:.?This.?email.?message.*original.?message.?/, '');
}

export function emojify(text) {
  return twemoji.parse(text);
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

export function sanitizeEmailSubject(text) {
  return sanitizeHtml(text, {
    allowedTags: [
      'img',
    ],
    allowedAttributes: {
      img: ['class', 'draggable', 'alt', 'src'],
    },
  });
}

export function cleanEmailTextBody(text) {
  text = text.replace(/\n\n/, '<br />');
  text = text.replace(/\n/, '');

  return text;
}

export function sanitizeEmailBodyPreview(text) {
  const maxLength = 300;
  const bareText = sanitizeHtml(text, { // eslint-disable-line prefer-template
    allowedTags: [],
    allowedAttributes: [],
  });

  if (bareText.length < maxLength) {
    return bareText;
  }

  return `${bareText.substring(0, maxLength)}...`;
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
    const updatedAt = Date.now();
    const id = shortid.generate();

    return {
      id,
      contentType: a.contentType,
      fileName: `${shortid.generate()}-${a.fileName}`,
      contentDisposition: a.contentDisposition,
      contentId: a.contentId || id,
      checksum: a.checksum,
      length: a.length,
      content: a.content,
      updatedAt,
    };
  });
}

export function processEmail(email, options = {}) {
  return new Promise((resolve) => {
    // mid should be unique to the message not the object
    const mid = email.messageId;
    const body = email.html ? sanitizeEmailBody(email.html) : cleanEmailTextBody(email.text);

    const processedEmail = {
      source: email.source,
      date: email.date,
      id: email.id,
      remote_id: email.id,
      mid,
      // headers: email.headers,
      to: email.to,
      from: email.from,
      subject: email.subject,
      // messageId: email.messageId,
      // text: email.text,
      body,
      bodyPreview: email.text ? `${email.text.substring(0, 150)}...` : '',
      attachments: [],
    };

    if (options.includeAttachments) {
      let attachments = email.attachments ? processAttachments(email.attachments) : [];
      processedEmail.attachments = attachments;

      if (options.resizeAttachments) {
        attachments = _.filter(attachments, (a) => { return a.content; });
        return Promise.all(attachments.map(resizeAttachment))
        .then((resizedAttachments) => {
          processedEmail.attachments = resizedAttachments;
          return resolve(processedEmail);
        });
      }
    }

    return resolve(processedEmail);
  });
}

export function processEmailFromMetadata(metadata) {
  return new Promise((resolve) => {
    const headers = metadata.payload.headers.reduce((acc, val) => {
      acc[val.name] = val.value;
      return acc;
    }, {});

    const processedEmail = {
      incomplete: true,
      id: metadata.id,
      remote_id: metadata.id,

      date: headers.Date,
      mid: (headers['Message-ID'] || `${metadata.id}@missionarymemoir.com`).replace(/^</, '').replace(/>$/, ''),
      to: headers.To,
      from: headers.From,
      subject: headers.Subject,

      body: metadata.snippet,
      bodyPreview: metadata.snippet,
      attachments: [],
    };

    return resolve(processedEmail);
  });
}

export function processEmailStream() {
  const transformStream = stream.Transform();  // eslint-disable-line new-cap

  transformStream._transform = (chunk, enc, next) => {
    const email = JSON.parse(chunk.toString('utf8'));
    const processedEmail = processEmail(email);
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
  return Compilation.findOne({ _id: page._compilation })
  .then((compilation) => {
    return new Promise((resolve) => {
      switch (page.type) {
        case 'cover' :
          return resolve(new CoverTemplate(page, { compilation }));
        case 'title-page' : {
          const startDate = compilation.meta.startingDate;
          const endDate = compilation.meta.endingDate;
          return resolve(new TitlePageTemplate(page, { startDate, endDate, compilation }));
        }
        case 'message-page' :
          return resolve(new MessagePageTemplate(page));
        case 'full-image-page' :
          return resolve(new FullImagePageTemplate(page));
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
  });
}

// export function calculateShipping(items, address) {
export function calculateShipping() {
  return 699;
}

export function resizeAttachment(attachment) {
  const maxWidthIn = 5;
  const pixelsPerInch = 300;
  const maxWidthPx = maxWidthIn * pixelsPerInch;

  return new Promise((resolve) => {
    const contentBuffer = new Buffer(attachment.content, 'base64');

    sharp(contentBuffer)
    .max(maxWidthPx, maxWidthPx)
    .toBuffer((err, outputBuffer, info) => {
      if (err) { return console.log('An error happened while resizing attachment image', err, attachment); }

      attachment.content = outputBuffer.toString('base64'); // eslint-disable-line
      attachment.resizeInfo = info; // eslint-disable-line

      resolve(attachment);
    });
  });
}

export function processCoverImage(image) {
  const maxWidthIn = 6;
  const pixelsPerInch = 300;
  const maxWidthPx = maxWidthIn * pixelsPerInch;

  return new Promise((resolve, reject) => {
    const contentBuffer = new Buffer(image.content, 'base64');

    sharp(contentBuffer)
    .resize(maxWidthPx)
    .toBuffer((err, outputBuffer, info) => {
      if (err) { reject('An error happened while resizing attachment image', err); }

      image.content = outputBuffer.toString('base64'); // eslint-disable-line
      image.resizeInfo = info; // eslint-disable-line
      image.updatedAt = Date.now(); // eslint-disable-line

      resolve(image);
    });
  });
}

export function extractImage(image, extractOptions) {
  return new Promise((resolve) => {
    const contentBuffer = new Buffer(image.content, 'base64');

    sharp(contentBuffer)
    .extract(extractOptions)
    .toBuffer((err, outputBuffer) => {
      if (err) { console.log('An error happened while resizing attachment image', err); }

      image.content = outputBuffer.toString('base64'); // eslint-disable-line
      // image.resizeInfo = info; // eslint-disable-line
      image.updatedAt = Date.now(); // eslint-disable-line

      resolve(image);
    });
    // }
  });
}

export function rotateImageAttachment(attachment, angle) {
  return new Promise((resolve) => {
    const request = require('request').defaults({ encoding: null }); // eslint-disable-line
    request.get(attachment.url, (err, res, contentBuffer) => {
      sharp(contentBuffer)
      .rotate(angle)
      .toBuffer((errr, outputBuffer) => {
        if (errr) { console.log('An error happened while rotating image', errr); }

        attachment.content = outputBuffer.toString('base64'); // eslint-disable-line
        attachment.updatedAt = Date.now(); // eslint-disable-line

        resolve(attachment);
      });
    });
  });
}

export function bufferToStream(buffer) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream;
}

export function removeFile(path) {
  return new Promise((resolve, reject) => {
    client.unlink(path, (err, results) => {
      if (err) { return reject({ message: err.message, err, path }); }

      resolve(results);
    });
  })
  .catch((err) => { console.log('Error happened when removing file', err); });
}

export function removeDir(path) {
  return new Promise((resolve, reject) => {
    client.rmr(path, (err, results) => {
      if (err) { return reject({ message: err.message, err, path }); }

      resolve(results);
    });
  })
  .catch((err) => { console.log('Error happened when removing dir', err); });
}

export function uploadAttachment(attachment) {
  return uploadImage(attachment, `compilations/${attachment._compilation}/attachments`);
}

export function uploadCoverImage(image) {
  return uploadImage(image, `compilations/${image._compilation}/cover-image`);
}

export function uploadPageImage(image) {
  return uploadImage(image, `compilations/${image._compilation}/page-images`);
}

export function uploadCoverThumbnailImage(image) {
  image.fileName = 'cover-thumbnail.png';

  return uploadImage(image, `compilations/${image._compilation}`);
}

export function uploadImage(image, path) {
  return new Promise((resolve, reject) => {
    let filename = image.fileName;

    if (image._id) {
      filename = `${image._id}-${filename}`;
    }

    const fullPath = `${process.env.MANTA_APP_PUBLIC_PATH}/${path}/${filename}`;
    const buffer = new Buffer(image.content, 'base64');

    const options = {
      mkdirs: true,
      headers: {
        'Access-Control-Allow-Headers': 'Range',
        'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
        'Access-Control-Allow-Origin': '*',
      },
    };

    client.put(fullPath, bufferToStream(buffer), options, (err) => {
      if (err) { return reject(err); }

      const uploadedAt = Date.now();

      client.info(fullPath, (newErr, results) => {
        if (newErr) { return reject({ message: newErr.message, newErr, fullPath }); }

        const url = `${process.env.MANTA_APP_URL}/${fullPath}?${uploadedAt}`;
        image.content = undefined;
        image.uploading = undefined;

        resolve({
          ...image,

          url,
          uploadedAt,
          path: fullPath,

          extension: results.extension,
          lastModified: results.headers['last-modified'],
          type: results.type,
          etag: results.etag,
          md5: results.md5,
          size: results.size,
          fileResults: results,
        });
      });
    });
  });
}

export function downloadFile(url) {
  const request = require('request').defaults({ encoding: null }); // eslint-disable-line

  return new Promise((resolve, reject) => {
    request(url, (err, res, buffer) => {
      if (err) return reject(err);

      const fileName = url.match(/\/([^\/]*?)$/)[1].replace(/\?.*$/, '');

      return resolve({
        fileName,
        content: buffer,
        contentType: res.headers['content-type'],
        length: res.headers['content-length'],
      });

      // id,
      // contentType: a.contentType,
      // fileName: `${shortid.generate()}-${a.fileName}`,
      // contentDisposition: a.contentDisposition,
      // contentId: a.contentId || id,
      // checksum: a.checksum,
      // length: a.length,
      // content: a.content,
      // updatedAt,
    });
  });
}

export function getAllImageSources(str) {
  const reg = /<img.*? src="(.*?)"/g;
  let matches = [];
  const output = [];
  while (matches = reg.exec(str)) { // eslint-disable-line
    output.push(matches[1]);
  }
  return _.uniq(output);
}

export function replaceImgTag(str, imgSrc, replacement) {
  const reg = new RegExp(`(<a[^>]*>)?<img[^>]*src="${_.escapeRegExp(imgSrc)}".*?>(</a>)?`);
  return str.replace(reg, replacement);
}
