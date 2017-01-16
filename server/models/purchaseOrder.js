import Mongoose, { Schema } from 'mongoose';
// import http from 'http';
import _ from 'lodash';
import shortid from 'shortid';
import Order from './order';
import { buildRequest } from '../util/requestHelpers';


// function requestLogger(httpModule) {
//   const original = httpModule.request;
//   httpModule.request = (options, callback) => { // eslint-disable-line
//     return original(options, callback);
//   };
//   return httpModule;
// }

const PurchaseOrderResponseSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  status: String,
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
  const request = Object.assign({}, this.request);
  request.Auth = config.auth;
  request.CustomerId = config.customerId;

  const options = {
    hostname: lsUrl.hostname,
    path: lsUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const https = require('https'); // eslint-disable-line
  // const https = requestLogger(require('https')); // eslint-disable-line

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      this.sentAt = new Date();

      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      req.on('error', (e) => {
        reject(`problem with response: ${e.message}`);
      });

      res.on('end', () => {
        if (body) {
          let status = 'SENT';
          try {
            body = JSON.parse(body);
            console.log('response body:', body);
          } catch (err) {
            console.log('error', err);
            console.log('response body:', body);
          }

          if (body.errors === 'yes') {
            status = 'ERROR';
          } else if (_.get(body, 'information.orderStatus')) {
            status = _.get(body, 'information.orderStatus');
          }

          const response = {
            status,
            body,
          };

          this.status = status;
          this.responses.push(response);
        } else {
          this.status = 'NORESPONSEBODY';
          console.log('no response body');
        }

        resolve(this.save());
      });
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
