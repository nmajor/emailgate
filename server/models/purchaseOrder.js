import Mongoose, { Schema } from 'mongoose';
import http from 'http';
import shortid from 'shortid';
import Order from './order';
import { buildRequest } from '../util/requestHelpers';


const PurchaseOrderResponseSchema = new Schema({
  _id: false,
  body: {},
}, {
  timestamps: true,
});

// const PurchaseOrderResponseSchema = new Schema({
//   _id: false,
//   status: String,
//   body: {},
// });

const PurchaseOrderSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  status: { type: String, default: 'NEW' },
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

PurchaseOrderSchema.methods.sendRequest = function sendRequest() {
  const url = require('url'); // eslint-disable-line

  const config = JSON.parse(process.env.LS_CONFIG);
  const lsUrl = url.parse(config.url);
  const request = this.request;
  request.Auth = config.auth;
  request.CustomerId = config.customerId;

  const options = {
    hostname: lsUrl.hostname,
    path: lsUrl.pathname,
    port: 80,
    method: 'POST',
  };

  console.log('blah', options);

  return new Promise((resolve) => {
    console.log('blah sending request');
    const req = http.request(options, (res) => {
      console.log('blah hey', res.body);
      this.sentAt = new Date();
      if (req.body) {
        this.status = res.body.information.orderStatus || 'SENT';
        this.responses.push(res.body);
      } else {
        this.status = 'BAD_RESPONSE';
      }

      resolve(this.save());
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(request));
    req.end();
  })
  .catch((err) => { console.log('An error happened when submitting Purchase Order request', err); });
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
