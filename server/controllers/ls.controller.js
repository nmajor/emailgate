import _ from 'lodash';
import PurchaseOrder from '../models/purchaseOrder';

export function orderStatusResponse(req, res) {
  const orders = _.uniqBy(req.body.information.ordersCreated, 'OrderNumber');
  Promise.all(orders.map((info) => {
    const poID = info.OrderNumber.replace('purc-', '');
    return PurchaseOrder.findOne({ _id: poID })
    .then((purchaseOrder) => {
      let status = purchaseOrder.status;

      if (req.body.errors === 'yes') {
        status = 'ERROR';
      } else if (_.get(req.body, 'information.orderStatus')) {
        status = _.get(req.body, 'information.orderStatus');
      }

      let body = req.body;

      try {
        JSON.parse(body);
      } catch (err) {
        console.log('Response not is valid json format');
        body = encodeURIComponent(body);
      }

      purchaseOrder.status = status; // eslint-disable-line no-param-reassign
      purchaseOrder.responses.push({ status, body });
      return purchaseOrder.save();
    });
  }))
  .then(() => {
    res.send('OK');
  });
}
