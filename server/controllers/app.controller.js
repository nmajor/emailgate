import { getGoogleAuthUrl } from '../util/googleAuth';
import Cart from '../models/cart';
import User from '../models/user';

export function getAppConfig(req, res) {
  Promise.all([
    getGoogleAuthUrl(),
  ])
  .then((values) => {
    const [googleAuthUrl] = values;
    const products = require('../products'); // eslint-disable-line global-require

    res.json({
      googleAuthUrl,
      products,
    });
  })
  .catch((err) => {
    console.log(`Error when getting app config ${err}`);
  });
}

export function getUserCart(req, res) {
  if (req.user) {
    Cart.findOrCreate({ _user: req.user._id, _order: null })
    .then((cart) => {
      res.json(cart);
    })
    .catch((err) => { console.log(err); });
  } else {
    res.json({});
  }
}

export function updatePassword(req, res) {
  const user = req.user;

  user.updatePassword(req.body.currentPassword, req.body.newPassword, req.body.newPasswordConfirm)
  .then((user) => { // eslint-disable-line no-shadow
    res.json(user);
  })
  .catch((err) => {
    res.json(err);
  });
}

export function forgotPassword(req, res) {
  User.findOne({ email: req.body.email })
  .then((user) => {
    if (!user) {
      res.json({ errors: { email: { message: 'Could not find user.' } } });
    }

    user.sendForgotPassword()
    .then(() => { // eslint-disable-line no-shadow
      res.json({});
    })
    .catch((err) => {
      res.json(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });
}

export function resetPassword(req, res) {
  res.json({ errors: { email: { message: 'Could not find user.' } } });
}
