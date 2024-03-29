import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import { getGoogleAuthToken, getGoogleProfile } from '../util/googleAuth';
import Account from '../models/account';
import base64 from 'base-64';

router.get('/google', (req, res) => {
  if (!req.user) { return res.redirect('/'); }

  const authCode = req.query.code;
  const userId = req.user._id;
  const statePropJsonString = base64.decode(req.query.state) || '{}';
  const stateProp = JSON.parse(statePropJsonString);

  getGoogleAuthToken(authCode)
  .then((token) => {
    return getGoogleProfile(token)
    .then((profile) => {
      return Account.findOrNew({
        _user: userId,
        kind: 'google',
        email: profile.emailAddress,
      })
      .then((account) => {
        account.props = { token }; // eslint-disable-line no-param-reassign
        return account.save();
      })
      .then((account) => {
        if (!stateProp.userReturnTo) { return Promise.resolve('/dashboard'); }
        return Promise.resolve(`${stateProp.userReturnTo}/${account._id}`);
      });
    });
  })
  .then((nextPath) => {
    res.redirect(nextPath);
  });
});

module.exports = router;
