import { getGoogleAuthUrl, getMyldsmailAuthUrl } from '../util/googleAuth';
import Cart from '../models/cart';
import User from '../models/user';
import Account from '../models/account';
import PromoCode from '../models/promoCode';
import Setting from '../models/setting';

export function getAppConfig(req, res) {
  Promise.all([
    getGoogleAuthUrl(),
    getMyldsmailAuthUrl(),
    Setting.find({}),
  ])
  .then((values) => {
    const [googleAuthUrl, myldsmailAuthUrl, settings] = values;
    const products = require('../products'); // eslint-disable-line global-require
    const staticData = require('../staticData'); // eslint-disable-line global-require

    res.json({
      googleAuthUrl,
      myldsmailAuthUrl,
      products,
      staticData,
      settings,
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
      return res.json({ errors: { email: { message: 'Could not find user.' } } });
    }

    return user.sendForgotPassword()
    .then(() => {
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
  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } })
  .then((user) => {
    if (!user) {
      return res.json({ errors: { email: { message: 'Password reset token is invalid or has expired.' } } });
    }

    return user.resetPassword(req.body.newPassword, req.body.newPasswordConfirm)
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

export function applyPromoCodeToCart(req, res) {
  PromoCode.findByCode(req.body.code)
  .then((promoCode) => {
    if (!promoCode) {
      return res.json({ error: { message: 'Invalid promo code' } });
    }

    return promoCode.isValid()
    .then((isValid) => {
      if (isValid) {
        return Cart.findOne({ _id: req.params.id })
        .then((cart) => {
          cart._promoCode = promoCode._id; // eslint-disable-line no-param-reassign
          return cart.save();
        })
        .then((cart) => {
          return Cart.findOne({ _id: cart._id }).populate('_promoCode');
        })
        .then((cart) => {
          res.json(cart);
        });
      }

      return res.json({ error: { message: 'Invalid promo code' } });
    })
    .catch((err) => {
      console.log('An error happened', err);
    });
  });
}

export function getFullEmail(req, res) {
  Account.findOne({ _user: req.user._id, _id: req.params.accountId })
  .then((account) => {
    return account.getEmailById(req.params.emailId);
  })
  .then((email) => {
    res.json(email);
  })
  .catch((err) => {
    console.log('An error happened', err);
  });
}

export function updateUserAppState(req, res) {
  return User.findOne({ _id: req.user._id, _order: null })
  .then((user) => {
    user.appState = req.body;
    return user.save();
  })
  .then((user) => {
    return res.json(user.appState);
  });
}
