import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import { getActivitySummaryData } from '../mailers/helper';
import ActivitySummary from '../mailers/ActivitySummary';

router.get('/activity-summary', (req, res) => {
  getActivitySummaryData()
  .then((props) => {
    const mailer = new ActivitySummary(props);
    res.send(mailer.toString());
  })
  .catch((err) => { console.log(err); });
});

module.exports = router;
