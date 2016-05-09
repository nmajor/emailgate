import { getGoogleAuthUrl } from '../util/googleAuth';
import Cart from '../models/cart';

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

export function getUserCart(req, res) {
  if (req.user) {
    Cart.findOrCreate({ _user: req.user._id })
    .then((cart) => {
      res.json(cart);
    });
  } else {
    res.json({});
  }
}
