import Order from '../models/order';
import Cart from '../models/cart';
import PromoCode from '../models/promoCode';

// export function findOneOrder(req, res) {
//   Order.findOne({ _user: req.user._id, _id: req.params.id })
//   .then((address) => {
//     res.json(address);
//   });
// }

export function getOrderPreview(req, res) {
  const order = new Order(req.body);
  order._user = req.user._id;
  order.build()
  .then((order) => { // eslint-disable-line no-shadow
    res.json(order);
  });
}

export function getOrders(req, res) {
  Order.find({ _user: req.user._id, transaction: { $ne: null } })
  .populate('_promoCode')
  .then((orders) => {
    res.json(orders);
  });
}

export function createOrder(req, res) {
  const newOrder = new Order(req.body);
  newOrder._user = req.user._id;
  newOrder.build()
  .then((order) => {
    return order.submitPayment();
  })
  .then((order) => {
    if (order.transaction) {
      return Cart.findOne({ _user: order._user, _id: req.body.cartId })
      .then((cart) => {
        cart._order = order._id; // eslint-disable-line no-param-reassign
        return cart.save();
      })
      .then(() => {
        return Promise.resolve(order);
      });
    }

    return Promise.resolve(order);
  })
  .then((order) => {
    res.json(order);
  })
  .catch((err) => {
    console.log(err);
  });
}

export function applyPromoCodeToOrderPreview(req, res) {
  PromoCode.findByCode(req.body.code)
  .then((promoCode) => {
    if (!promoCode) {
      return res.json({ error: { message: 'Invalid promo code' } });
    }

    return promoCode.isValid()
    .then((isValid) => {
      if (isValid) {
        return Cart.findOne({ _id: req.body.cartId })
        .then((cart) => {
          cart._promoCode = promoCode._id; // eslint-disable-line no-param-reassign
          return cart.save();
        })
        .then(() => {
          const order = new Order(req.body);
          order._user = req.user._id;
          order.build()
          .then((order) => { // eslint-disable-line no-shadow
            res.json(order);
          });
        });
      }

      return res.json({ error: { message: 'Invalid promo code' } });
    })
    .catch((err) => {
      console.log('an error happened applyting a promo code', err);
    });
  });
}
