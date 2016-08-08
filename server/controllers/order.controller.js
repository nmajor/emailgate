import Order from '../models/order';
import Cart from '../models/cart';

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
