import passport from 'passport';
import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import * as AccountController from '../controllers/account.controller';

import User from '../models/user';

router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401);
    res.json({ error: { message: 'User not logged in.' } });
  }
});

router.post('/register', (req, res) => {
  User.register(new User({ email: req.body.email }), req.body.password, (err, user) => {
    if (err) {
      return res.json({ error: {
        message: err.message,
        error: err,
      } });
    }

    passport.authenticate('local')(req, res, () => {
      res.json(user);
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({});
});

router.get('/health', (req, res) => {
  res.send('OK');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated.');
    next();
  } else {
    res.status(401);
    res.json({ error: { message: 'Unauthorized. User may not be logged in.' } });
  }
}

router.get('/accounts', ensureAuthenticated, AccountController.getAccount);
router.get('/accounts/:id', ensureAuthenticated, AccountController.findOneAccount);
router.post('/accounts', ensureAuthenticated, AccountController.createAccount);
router.put('/accounts/:id', ensureAuthenticated, AccountController.patchAccount);
router.patch('/accounts/:id', ensureAuthenticated, AccountController.patchAccount);

module.exports = router;