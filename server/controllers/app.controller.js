import { getGoogleAuthUrl } from '../util/googleAuth';

export function getAppConfig(req, res) {
  Promise.all([
    getGoogleAuthUrl(),
  ])
  .then((values) => {
    const [googleAuthUrl] = values;
    const products = require('../products');

    res.json({
      googleAuthUrl,
      products,
    });
  })
  .catch((err) => {
    console.log(`Error when getting app config ${err}`);
  });
}
