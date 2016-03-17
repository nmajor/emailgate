import stream from 'stream';
// import crypto from 'crypto';

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

  return imapFilter;
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
      text: email.text,
      // html: email.html,
      attachments: email.attachments,
    };

    transformStream.push(new Buffer(JSON.stringify(processedEmail)));
    next();
  };

  return transformStream;
}