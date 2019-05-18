import request from 'superagent';
import { stringToSha1 } from '../../shared/helpers';

const defaultOptions = {
  height: '9in',
  width: '6in',
};

export function createPdf(html) {
  return new Promise((resolve, reject) => {
    const url = 'https://5xv8tyflef.execute-api.us-east-1.amazonaws.com/prod/api/pdf/create';

    // console.log('blah hello data', JSON.stringify({ html, options: { ...defaultOptions } }));

    request
      .post(url)
      .send({ html, options: { ...defaultOptions } })
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err) return reject(err);
        if (res.body.message) return reject(res.body.message);
        if (!res.body.url) {
          console.log('PDF creation failed', res.body);
          return reject('PDF creation failed.');
        }

        const { body } = res;
        body.meta.pageCount = parseInt(body.meta.pageCount, 10);
        const response = {
          ...body,
          pageCount: body.meta.pageCount,
          htmlSha1: stringToSha1(html),
        };

        resolve(response);
      });
  });
}
