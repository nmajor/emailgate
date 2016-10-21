// import _ from 'lodash';
import PurchaseOrder from '../models/purchaseOrder';

export function orderStatusResponse(req, res) {
  Promise.all(req.body.information.ordersCreated.map((info) => {
    const poID = info.OrderNumber.replace('purc-', '');
    return PurchaseOrder.findOne({ _id: poID })
    .then((purchaseOrder) => {
      purchaseOrder.status = req.body.information.orderStatus; // eslint-disable-line no-param-reassign
      purchaseOrder.responses.push({ body: req.body });
      return purchaseOrder.save();
    });
  }))
  .then(() => {
    res.send('OK');
  });
}
