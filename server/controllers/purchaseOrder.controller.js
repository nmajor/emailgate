import PurchaseOrder from '../models/purchaseOrder';

export function findOne(req, res) {
  PurchaseOrder.findOne({ _id: req.params.id })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function get(req, res) {
  PurchaseOrder.find({})
  .populate('orders')
  .then((purchaseOrders) => {
    res.json(purchaseOrders);
  });
}

export function create(req, res) {
  const newPurchaseOrder = new PurchaseOrder(req.body);
  newPurchaseOrder.save()
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  })
  .catch((err) => {
    console.log('An error happened', err);
  });
}

export function patch(req, res) {
  PurchaseOrder.findOne({ _id: req.params.id })
  .then((purchaseOrder) => {
    return purchaseOrder.save();
  })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function remove(req, res) {
  PurchaseOrder.remove({ _id: req.params.id })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function addOrder(req, res) {
  PurchaseOrder.findOne({ _id: req.params.id })
  .then((purchaseOrder) => {
    return purchaseOrder.addOrder(req.body.orderId);
  })
  .then((purchaseOrder) => {
    return purchaseOrder.updateRequest();
  })
  .then((purchaseOrder) => {
    return purchaseOrder.populate('orders');
  })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  })
  .catch((err) => { console.log('An error happened', err); });
}

export function removeOrder(req, res) {
  PurchaseOrder.findOne({ _id: req.params.id })
  .then((purchaseOrder) => {
    return purchaseOrder.removeOrder(req.body.orderId);
  })
  .then((purchaseOrder) => {
    console.log('blah hey ', purchaseOrder);
    return purchaseOrder.updateRequest();
  })
  .then((purchaseOrder) => {
    return purchaseOrder.populate('orders');
  })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  })
  .catch((err) => { console.log('An error happened', err); });
}

export function updateRequest(req, res) {
  PurchaseOrder.findOne({ _id: req.params.id })
  .then((purchaseOrder) => {
    return purchaseOrder.updateRequest();
  })
  .then((purchaseOrder) => {
    return purchaseOrder.populate('orders');
  })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}
