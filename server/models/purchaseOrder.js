import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Order from './order';

const PurchaseOrderResponseSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  status: String,
  body: {},
});

const PurchaseOrderSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  orders: [{ type: String, ref: 'Order' }],
  request: {},
  responses: [PurchaseOrderResponseSchema],
  sentAt: Date,
}, {
  timestamps: true,
});

PurchaseOrderSchema.post('init', (doc, next) => {
  if (this.sentAt && this.request) { return next(); }

  return this.buildRequest()
  .then(() => {
    next();
  });
});

PurchaseOrderSchema.methods.buildRequest = function buildRequest() {
  Order.find({ _purchaseOrder: this._id })
  .then(() => {
    this.request = {

    };
  });
};

PurchaseOrderSchema.methods.addOrder = function addOrder(orderId) {
  return Order.findOne({ _id: orderId })
  .then((order) => {
    order._purchaseOrder = this._id; // eslint-disable-line no-param-reassign
    return order.save();
  });
};

export default Mongoose.model('PurchaseOrder', PurchaseOrderSchema);
