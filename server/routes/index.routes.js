import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;
