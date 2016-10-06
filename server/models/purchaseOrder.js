import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Order from './order';
import { buildRequest } from '../util/requestHelpers';

const PurchaseOrderResponseSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  status: String,
  body: {},
});

const PurchaseOrderSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  request: {},
  orders: [{ type: String, ref: 'Order' }],
  responses: [PurchaseOrderResponseSchema],
  sentAt: Date,
}, {
  timestamps: true,
});

PurchaseOrderSchema.methods.rebuildRequest = function rebuildRequest() {
  return Order.findAndBuildItemProps({ _purchaseOrder: this._id })
  .then((orders) => {
    this.request = buildRequest(this, orders);
    return this.save();
  });
};

PurchaseOrderSchema.methods.updateOrders = function updateOrders() {
  return Order.find({ _purchaseOrder: this._id })
  .then((orders) => {
    this.orders = orders;
    return this.save();
  });
};

PurchaseOrderSchema.methods.addOrder = function addOrder(orderId) {
  return Order.update({ _id: orderId }, { $set: { _purchaseOrder: this._id } })
  .then(() => {
    return this.updateOrders();
  });
};

PurchaseOrderSchema.methods.removeOrder = function removeOrder(orderId) {
  return Order.findOne({ _id: orderId, _purchaseOrder: this._id })
  .then((order) => {
    if (order) {
      return Order.update({ _id: orderId }, { $set: { _purchaseOrder: null } });
    }

    return Promise.resolve();
  })
  .then(() => {
    return this.updateOrders();
  });
};

export default Mongoose.model('PurchaseOrder', PurchaseOrderSchema);
