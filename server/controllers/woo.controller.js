import _ from 'lodash';
import PromoCode from '../models/promoCode';
import crypto from 'crypto';
import products from '../products';

export function orderCreated(req, res) {
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
    .then(() => {
      res.statusCode(200);
    })
    .catch((err) => { console.log('An error happened when creating a promo code from woo webhook', err); });
  }
}
