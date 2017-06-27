import pdf from 'html-pdf';

export function htmlToPdf(html, options = {}) {
  return new Promise((resolve, reject) => {
    return pdf.create(html, options).toBuffer((err, buffer) => { // eslint-disable-line consistent-return
      if (err) { return reject(err); }

      resolve(buffer);
    });
  });
}
