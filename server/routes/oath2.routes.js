import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import { getGoogleAuthToken } from '../util/googleAuth';
import Account from '../models/account';
import base64 from 'base-64';

router.get('/google', (req, res) => {
  console.log('blah oath2/google req params');
  console.log(req.query);
  const authCode = req.query.code;
  const userId = req.user._id;
  const statePropJsonString = base64.decode(req.query.state) || '{}';
  const stateProp = JSON.parse(statePropJsonString);
  const nextPath = stateProp.userReturnTo || '/';
  console.log(userId);
  console.log(stateProp);

  getGoogleAuthToken(authCode)
  .then((token) => {
    console.log('blah hey');
    console.log({
      _user: userId,
      kind: 'google',
      token,
    });
    const newAccount = new Account({
      _user: userId,
      kind: 'google',
      token,
    });
    return newAccount.save();
  })
  .then(() => {
    res.redirect(nextPath);
  });
});

module.exports = router;
