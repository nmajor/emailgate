import User from '../models/user';
import Compilation from '../models/compilation';
import Order from '../models/order';

export function getUsers(req, res) {
  User.find({})
  .then((users) => {
    res.json(users);
  });
}

export function getCompilations(req, res) {
  Compilation.find({})
  .then((compilations) => {
    res.json(compilations);
  });
}

export function getOrders(req, res) {
  const query = {};

  if (req.query.nullPurchaseOrder) { query._purchaseOrder = { $eq: null }; }

  new Promise((resolve) => {
    if (req.query.includeItemProps) { return resolve(Order.findAndBuildItemProps(query)); }
    return resolve(Order.find(query));
  })
  .then((orders) => {
    res.json(orders);
  });
}
