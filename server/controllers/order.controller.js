import Order from '../models/order';
import Cart from '../models/cart';

export function findOneOrder(req, res) {
  Order.findOne({ _user: req.user._id, _id: req.params.id })
  .then((address) => {
    res.json(address);
  });
}

export function getOrders(req, res) {
  Order.find({ _user: req.user._id })
  .then((orders) => {
    res.json(orders);
  });
}

export function createOrder(req, res) {
  const newOrder = new Order(req.body);
  newOrder._user = req.user._id;
  newOrder.save()
  .then((order) => {
    return Cart.findOne({ _user: order._user, _id: req.body.cartId })
    .then((cart) => {
      cart._order = order._id; // eslint-disable-line no-param-reassign
      return cart.save();
    })
    .then(() => {
      return Promise.resolve(order);
    });
  })
  .then((order) => {
    return order.submitPayment();
  })
  .then((order) => {
    res.json(order);
  });
}
