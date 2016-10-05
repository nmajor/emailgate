import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

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

export default Mongoose.model('PurchaseOrder', PurchaseOrderSchema);
