import _ from 'lodash';
import PromoCode from '../models/promoCode';
import Order from '../models/order';
import Address from '../models/address';
import crypto from 'crypto';
import products from '../products';

export function orderCreated(req, res) {
  console.log('Webhook request', req.rawBody, req.body);

  if (!req.rawBody && _.get(req, 'body.webhook_id')) {
    return res.send('ok');
  }
  const secret = 'elevendollarbillsbutyouonlygotten';
  const hash = crypto.createHmac('SHA256', secret).update(req.rawBody).digest('base64');
  if (hash === req.headers['x-wc-webhook-signature']) {
    const newPromo = new PromoCode({
      kind: 'voucher',
      oneTimeUse: true,
      freeShipping: true,
      email: req.body.billing.email,
    });

    _.forEach(req.body.line_items, (item) => {
      const product = _.find(products, { wooSku: item.sku });
      if (product) {
        newPromo.productVouchers.push({ productId: product._id, quantity: item.quantity });
      }
    });

    newPromo.save()
    .then((promoCode) => {
      return promoCode.deliverToEmail()
      .then(() => {
        const { billing } = req.body;
        const billingAddress = new Address({
          firstName: billing.first_name,
          lastName: billing.last_name,
          address1: billing.address_1,
          address2: billing.address_2,
          city: billing.city,
          region: billing.state,
          postalCode: billing.postcode,
          phone: billing.phone,
        });
        const newOrder = new Order({
          amount: parseInt(req.body.total, 10) * 100,
          discount: parseInt(req.body.discount_total, 10) * 100,
          shipping: parseInt(req.body.shipping_total, 10) * 100,
          tax: parseInt(req.body.total_tax, 10) * 100,
          billingAddress: billingAddress.toObject(),
          transaction: req.body,
          data: { promoCodeId: promoCode._id },
          skipBuild: true,
        });

        return newOrder.save();
      })
      .catch((err) => { console.log('An error happened when saving woo webhook order', err); });
    })
    .then(() => {
      res.send('OK');
    })
    .catch((err) => { console.log('An error happened when creating a promo code from woo webhook', err, err.stack); });
  } else {
    return res.send('invalid request');
  }
}
