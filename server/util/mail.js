const apiKey = process.env.MAILGUN_API_KEY;
const domain = 'mg.missionarymemoir.com';
import mailgunJs from 'mailgun-js';

export function sendMail(data) {
  return new Promise((resolve, reject) => {
    const from = data.from || 'Missionary Memoir <no-reply@missionarymemoir.com>';

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
