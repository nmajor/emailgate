import Order from '../models/order';

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
    return order.submitPayment();
  })
  .then((order) => {
    res.json(order);
  });
}
