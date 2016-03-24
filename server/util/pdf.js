import pdf from 'html-pdf';

export function emailPdf(email) {
  return new Promise((resolve) => {
    pdf.create(email.body).toStream((err, stream) => {
      resolve(stream);
    });
  });
}
