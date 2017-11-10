// import _ from 'lodash';
// import Email from '../models/email';
// import Compilation from '../models/compilation';
import crypto from 'crypto';

export function createEmail(req, res) {
  console.log('Webhook request', req.rawBody, req.body);

  const secret = process.env.MAIL_BUCKET_SECRET;
  const hash = crypto.createHmac('SHA256', secret).update(req.rawBody).digest('base64');
  if (hash === req.headers['x-webhook-signature']) {
    console.log('blah sig yes');
    res.send('ok');
  } else {
    return res.send('invalid request');
  }
}
