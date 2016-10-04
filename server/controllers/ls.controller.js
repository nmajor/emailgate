import _ from 'lodash';

export function orderStatusResponse(req, res) {
  _.forEach(req.body.information.ordersCreated, (info) => {
    console.log(info.OrderNumber);
  });

  console.log(req.body.information.orderStatus);
  res.send('OK');
}
