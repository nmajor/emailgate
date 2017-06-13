const apiKey = process.env.MAILGUN_API_KEY;
const domain = 'sandbox81435.mailgun.org';
import mailgunJs from 'mailgun-js';

export function sendMail(data) {
  return new Promise((resolve, reject) => {
    const from = 'MyEmailBook <no-reply@myemailbook.com>';

    const mailData = {
      from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    };

    const mailgun = mailgunJs({ apiKey, domain });

    mailgun.messages().send(mailData, (err, body) => {
      if (err) { return reject(err); }

      resolve(body);
    });
  });
}
