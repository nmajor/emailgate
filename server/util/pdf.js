import pdf from 'html-pdf';
import * as sharedHelpers from '../../shared/helpers';

export function emailPdf(email) {
  return new Promise((resolve) => {
    const html = sharedHelpers.pageEmailHtml(email);

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
