import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import PromoCode from '../models/promoCode';
import { getActivitySummaryExampleData } from '../mailers/helper';
import ActivitySummary from '../mailers/ActivitySummary';
import VoucherWelcome from '../mailers/VoucherWelcome';

router.get('/activity-summary', (req, res) => {
  getActivitySummaryExampleData()
  .then((props) => {
    const mailer = new ActivitySummary(props);
    res.send(mailer.toString());
  })
  .catch((err) => { console.log(err); });
});

router.get('/voucher-welcome/:promoCodeId', (req, res) => {
  PromoCode.findOne({ _id: req.params.promoCodeId })
  .then((promoCode) => {
    const mailer = new VoucherWelcome({ promoCode });
    res.send(mailer.toString());
  });
});

module.exports = router;
