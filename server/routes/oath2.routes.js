import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import { getGoogleAuthToken, getGoogleProfile } from '../util/googleAuth';
import Account from '../models/account';
import base64 from 'base-64';

router.get('/google', (req, res) => {
  const authCode = req.query.code;
  const userId = req.user._id;
  const statePropJsonString = base64.decode(req.query.state) || '{}';
  const stateProp = JSON.parse(statePropJsonString);
  const nextPath = stateProp.userReturnTo || '/';

  getGoogleAuthToken(authCode)
  .then((token) => {
    const newAccount = new Account({
      _user: userId,
      kind: 'google',
      authProps: {
        token,
      },
    });

    return getGoogleProfile(newAccount)
    .then((profile) => {
      newAccount.email = profile.emailAddress;

      return newAccount.save();
    });
  })
  .then(() => {
    res.redirect(nextPath);
  });
});

module.exports = router;
