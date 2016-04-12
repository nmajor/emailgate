import { getGoogleAuthUrl } from '../util/googleAuth';

export function getAppConfig(req, res) {
  Promise.all([
    getGoogleAuthUrl(),
  ])
  .then((values) => {
    const [googleAuthUrl] = values;

    res.json({
      googleAuthUrl,
    });
  })
  .catch((err) => {
    console.log(`Error when getting app config ${err}`);
  });
}
