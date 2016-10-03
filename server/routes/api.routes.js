import passport from 'passport';
import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap
import * as AccountController from '../controllers/account.controller';
import * as AddressController from '../controllers/address.controller';
import * as CompilationController from '../controllers/compilation.controller';
import * as EmailController from '../controllers/email.controller';
import * as PageController from '../controllers/page.controller';
import * as OrderController from '../controllers/order.controller';
import * as AdminController from '../controllers/admin.controller';
import * as AppController from '../controllers/app.controller';

import User from '../models/user';

import { emailPageMap } from '../util/helpers';
import Compilation from '../models/compilation';

export function getCompilationEmailPageMap(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    return emailPageMap(compilation._id);
  })
  .then((pageMap) => {
    res.json(pageMap);
  });
}

router.get('/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401);
    res.json({ error: { message: 'User not logged in.' } });
  }
});

router.post('/register', (req, res) => {
  User.register(new User({ email: req.body.email, name: req.body.name }), req.body.password, (err, user) => {
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    res.json({ error: { message: 'Unauthorized. User may not be logged in.' } });
  }
}

function ensureAdmin(req, res, next) {
  if (req.user.isAdmin || req.user.email === 'nick@nmajor.com') {
    console.log('User is an admin.');
    next();
  } else {
    res.status(401);
    res.json({ error: { message: 'Unauthorized. You are not an admin bro.' } });
  }
}

router.get('/config', AppController.getAppConfig);
router.get('/cart', AppController.getUserCart);

router.put('/update-password', AppController.updatePassword);
router.post('/update-password', AppController.updatePassword);

router.put('/forgot-password', AppController.forgotPassword);
router.post('/forgot-password', AppController.forgotPassword);

router.put('/reset-password', AppController.resetPassword);
router.post('/reset-password', AppController.resetPassword);

router.get('/orders', ensureAuthenticated, OrderController.getOrders);
router.post('/orders', ensureAuthenticated, OrderController.createOrder);
router.post('/orders/preview', ensureAuthenticated, OrderController.getOrderPreview);

router.get('/accounts', ensureAuthenticated, AccountController.getAccounts);
router.get('/accounts/:id', ensureAuthenticated, AccountController.findOneAccount);
router.post('/accounts', ensureAuthenticated, AccountController.createAccount);
router.put('/accounts/:id', ensureAuthenticated, AccountController.patchAccount);
router.patch('/accounts/:id', ensureAuthenticated, AccountController.patchAccount);

router.get('/addresses', ensureAuthenticated, AddressController.getAddresses);
router.get('/addresses/:id', ensureAuthenticated, AddressController.findOneAddress);
router.post('/addresses', ensureAuthenticated, AddressController.createAddress);
router.put('/addresses/:id', ensureAuthenticated, AddressController.patchAddress);
router.patch('/addresses/:id', ensureAuthenticated, AddressController.patchAddress);
router.delete('/addresses/:id', ensureAuthenticated, AddressController.removeAddress);

router.get('/compilations', ensureAuthenticated, CompilationController.getCompilations);
router.get('/compilations/:id', ensureAuthenticated, CompilationController.findOneCompilation);
router.post('/compilations', ensureAuthenticated, CompilationController.createCompilation);
router.put('/compilations/:id', ensureAuthenticated, CompilationController.patchCompilation);
router.patch('/compilations/:id', ensureAuthenticated, CompilationController.patchCompilation);

router.patch('/compilations/:id/page', ensureAuthenticated, CompilationController.patchCompilationPage);
router.put('/compilations/:id/page', ensureAuthenticated, CompilationController.patchCompilationPage);

router.get('/compilations/:id/emails', ensureAuthenticated, EmailController.getCompilationEmails);
router.get('/compilations/:id/email-page-map', ensureAuthenticated, getCompilationEmailPageMap);
router.get('/compilations/:id/pages', ensureAuthenticated, PageController.getCompilationPages);

router.get('/admin/users', ensureAuthenticated, ensureAdmin, AdminController.getUsers);
router.get('/admin/compilations', ensureAuthenticated, ensureAdmin, AdminController.getCompilations);
router.get('/admin/orders', ensureAuthenticated, ensureAdmin, AdminController.getOrders);

module.exports = router;
