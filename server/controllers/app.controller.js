import { getGoogleAuthUrl } from '../util/googleAuth';
import Cart from '../models/cart';

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

function updatePasswordError(field, message) {
  return {
    errors: {
      [field]: { message },
    },
  };
}

export function updatePassword(req, res) {
  const user = req.user;

  user.checkPassword(req.body.currentPassword, (err, passwordValid) => {
    if (passwordValid) {
      if (req.body.newPassword !== req.body.newPasswordConfirm) {
        res.json(updatePasswordError('newPasswordConfirm', 'Confirm password field does not match new password.'));
      } else {
        user.setPassword(req.body.newPassword, (err, user) => { // eslint-disable-line no-shadow
          if (err) {
            res.json(err);
          } else {
            user.save()
            .then((user) => { // eslint-disable-line no-shadow
              res.json(user);
            });
          }
        });
      }
    } else {
      res.json(updatePasswordError('currentPassword', 'Current password is not correct.'));
    }
  });
}
