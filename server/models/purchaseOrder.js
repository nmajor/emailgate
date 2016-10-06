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
  responses: [PurchaseOrderResponseSchema],
  sentAt: Date,
}, {
  timestamps: true,
});

PurchaseOrderSchema.methods.updateRequest = function updateRequest() {
  console.log('blah updateRequest');
  return Order.findAndBuildItemProps({ _purchaseOrder: this._id })
  .then((orders) => {
    this.request = buildRequest(this, orders);
    return this.save();
  });
};

PurchaseOrderSchema.methods.addOrder = function addOrder(orderId) {
  console.log('blah addOrder', orderId);
  return Order.update({ _id: orderId }, { $set: { _purchaseOrder: this._id } })
  .then(() => {
    return Promise.resolve(this);
  });
};

export default Mongoose.model('PurchaseOrder', PurchaseOrderSchema);
