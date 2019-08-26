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
  _id: { type: String, default: shortid.generate },
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
  serviceLevel: { type: String, default: 'SL10' },
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
  // const lsUrl = url.parse(config.url);
  const request = Object.assign({}, this.request);
  request.Auth = config.auth;
  request.CustomerId = config.customerId;

  const options = {
    url: config.url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(request),
  };
  //
  // return require('superagent')
  // .post(options.url)
  // .send(request) // sends a JSON post body
  // .end((err, res) => {
  //   console.log('blah hey res', res);
  //   const body = res.body;
  //   if (body) {
  //     let status = 'SENT';
  //
  //     if (body.errors === 'yes') {
  //       status = 'ERROR';
  //     } else if (_.get(body, 'information.orderStatus')) {
  //       status = _.get(body, 'information.orderStatus');
  //     }
  //
  //     const response = {
  //       status,
  //       body,
  //     };
  //
  //     this.status = status;
  //     this.responses.push(response);
  //   } else {
  //     this.status = 'NORESPONSEBODY';
  //     console.log('no response body');
  //   }
  //
  //   return this.save();
  // })
  // .catch((err) => { console.log('An error happened when submitting Purchase Order request', err); });


  const axios = require('axios');
  return axios(options)
  .then((res) => {
    const body = res.data;
    if (body) {
      let status = 'SENT';

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

    return this.save();
  })
  .catch((err) => { console.log('An error happened when submitting Purchase Order request', err); });


  // const https = require('https'); // eslint-disable-line
  // // const https = requestLogger(require('https')); // eslint-disable-line
  //
  // return new Promise((resolve, reject) => {
  //   const req = https.request(options, (res) => {
  //     this.sentAt = new Date();
  //
  //     let body = '';
  //
  //     res.on('data', (chunk) => {
  //       body += chunk;
  //     });
  //
  //     res.on('end', () => {
  //       if (body) {
  //         let status = 'SENT';
  //         try {
  //           body = JSON.parse(body);
  //         } catch (err) {
  //           console.log('an error happened when sending a purchase order request', err);
  //         }
  //
  //         if (body.errors === 'yes') {
  //           status = 'ERROR';
  //         } else if (_.get(body, 'information.orderStatus')) {
  //           status = _.get(body, 'information.orderStatus');
  //         }
  //
  //         const response = {
  //           status,
  //           body,
  //         };
  //
  //         this.status = status;
  //         this.responses.push(response);
  //       } else {
  //         this.status = 'NORESPONSEBODY';
  //         console.log('no response body');
  //       }
  //
  //       resolve(this.save());
  //     });
  //   });
  //
  //   req.on('error', (e) => {
  //     console.error(e);
  //     console.log(`problem with request: ${e.message}`);
  //   });
  //
  //   req.write(JSON.stringify(request));
  //   req.end();
  // })
  // .catch((err) => { console.log('An error happened when submitting Purchase Order request', err); });
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
