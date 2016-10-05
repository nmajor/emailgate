import PurchaseOrder from '../models/purchaseOrder';

export function findOne(req, res) {
  PurchaseOrder.findOne({ _user: req.user._id, _id: req.params.id })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function get(req, res) {
  PurchaseOrder.find({ _user: req.user._id })
  .then((purchaseOrders) => {
    res.json(purchaseOrders);
  });
}

export function create(req, res) {
  const newPurchaseOrder = new PurchaseOrder(req.body);
  newPurchaseOrder._user = req.user._id;
  newPurchaseOrder.save()
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function patch(req, res) {
  PurchaseOrder.findOne({ _user: req.user._id, _id: req.params.id })
  .then((purchaseOrder) => {
    purchaseOrder.authProps = req.body.authProps; // eslint-disable-line no-param-reassign

    return purchaseOrder.save();
  })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}

export function remove(req, res) {
  PurchaseOrder.remove({ _user: req.user._id, _id: req.params.id })
  .then((purchaseOrder) => {
    res.json(purchaseOrder);
  });
}
