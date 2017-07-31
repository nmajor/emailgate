import passport from 'passport';
import express from 'express';
const router = express.Router(); // eslint-disable-line new-cap

import * as AccountController from '../controllers/account.controller';
import * as AddressController from '../controllers/address.controller';
import * as CompilationController from '../controllers/compilation.controller';
import * as EmailController from '../controllers/email.controller';
import * as OrderController from '../controllers/order.controller';
import * as PageController from '../controllers/page.controller';
import * as AdminController from '../controllers/admin.controller';
import * as AppController from '../controllers/app.controller';
import * as PurchaseOrderController from '../controllers/purchaseOrder.controller';
import * as PromoCodeController from '../controllers/promoCode.controller';

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

router.post('/register/tmp', (req, res) => {
  if (req.user) { return res.json(req.user); }

  const tmpUser = new User({});
  const password = Math.random().toString(36).substr(2, 8);
  tmpUser.name = `Temp User ${tmpUser._id}`;
  tmpUser.email = `tmp-${tmpUser._id}@missionarymemoir.com`;

  User.register(tmpUser, password, (err, user) => {
    if (err) {
      return res.json({ error: {
        message: err.message,
        error: err,
      } });
    }

    req.user = user; // eslint-disable-line no-param-reassign
    req.body.password = password; // eslint-disable-line no-param-reassign
    req.body.email = user.email; // eslint-disable-line no-param-reassign
    passport.authenticate('local')(req, res, () => {
      User.findOne({ _id: user._id })
      .then((freshUser) => {
        res.json(freshUser);
      });
    });
  });
});

router.post('/register', (req, res) => {
  if (req.user && !req.user.isTmp) { return res.json(req.user); }
  if (req.user && req.user.isTmp) {
    return req.user.unTmp(req.body.name, req.body.email, req.body.password)
    .then((user) => {
      passport.authenticate('local')(req, res, () => {
        res.json(user);
      });
    });
  }

  return User.register(new User({ email: req.body.email, name: req.body.name, isTmp: false }), req.body.password, (err, user) => {
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

router.post('/login', (req, res) => {
  if (req.user && !req.user.isTmp) { return res.json(req.user); }

  const email = req.body.email.trim().toLowerCase();
  User.findOne({ email })
  .then((user) => {
    if (user && req.user && req.user.isTmp) {
      return user.absorbTmpUser(req.user)
      .then(() => {
        return passport.authenticate('local')(req, res, () => {
          res.json(user);
        });
      });
    } else if (user) {
      return user.authenticate(req.body.password, (err, result) => {
        if (result) {
          return passport.authenticate('local')(req, res, () => {
            return res.json(user);
          });
        }

        res.status(401);
        return res.send('Unauthorized');
      });
    }

    res.status(401);
    return res.send('Unauthorized');
  });
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
  const admins = [
    'nick@nmajor.com',
    'king.benjamin012@gmail.com',
  ];

  if (req.user.isAdmin || admins.indexOf(req.user.email) > -1) {
    console.log('User is an admin.');
    next();
  } else {
    res.status(401);
    res.json({ error: { message: 'Unauthorized. You are not an admin bro.' } });
  }
}

router.get('/config', AppController.getAppConfig);
router.get('/cart', AppController.getUserCart);
router.post('/cart/:id/promo', AppController.applyPromoCodeToCart);

router.put('/update-password', AppController.updatePassword);
router.post('/update-password', AppController.updatePassword);

router.put('/forgot-password', AppController.forgotPassword);
router.post('/forgot-password', AppController.forgotPassword);

router.put('/reset-password', AppController.resetPassword);
router.post('/reset-password', AppController.resetPassword);

router.get('/emails/full/:accountId/:emailId', ensureAuthenticated, AppController.getFullEmail);

router.get('/orders', ensureAuthenticated, OrderController.getOrders);
router.post('/orders', ensureAuthenticated, OrderController.createOrder);
router.post('/orders/preview/promo', ensureAuthenticated, OrderController.applyPromoCodeToOrderPreview);
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
router.post('/compilations', CompilationController.createCompilation);
router.put('/compilations/:id', ensureAuthenticated, CompilationController.patchCompilation);
router.patch('/compilations/:id', ensureAuthenticated, CompilationController.patchCompilation);
router.delete('/compilations/:id', ensureAuthenticated, CompilationController.removeCompilation);
router.post('/compilations/:id/add-blank', ensureAuthenticated, CompilationController.addBlankEmail);
// router.post('/compilations/:id/add-image', ensureAuthenticated, CompilationController.addImage);

router.patch('/compilations/:id/page', ensureAuthenticated, CompilationController.patchCompilationPage);
router.put('/compilations/:id/page', ensureAuthenticated, CompilationController.patchCompilationPage);

router.get('/compilations/:id/emails', ensureAuthenticated, EmailController.getCompilationEmails);
router.get('/compilations/:id/email-page-map', ensureAuthenticated, getCompilationEmailPageMap);
router.get('/compilations/:id/pages', ensureAuthenticated, PageController.getCompilationPages);

router.get('/admin/users', ensureAuthenticated, ensureAdmin, AdminController.getUsers);
router.get('/admin/compilations', ensureAuthenticated, ensureAdmin, AdminController.getCompilations);
router.put('/admin/compilations/:id', ensureAuthenticated, ensureAdmin, AdminController.patchCompilation);
router.patch('/admin/compilations/:id', ensureAuthenticated, ensureAdmin, AdminController.patchCompilation);
router.get('/admin/orders', ensureAuthenticated, ensureAdmin, AdminController.getOrders);
router.get('/admin/emails/:id', ensureAuthenticated, ensureAdmin, AdminController.findEmail);
router.get('/admin/pages/:id', ensureAuthenticated, ensureAdmin, AdminController.findPage);

router.get('/admin/purchase-orders', ensureAuthenticated, ensureAdmin, PurchaseOrderController.get);
router.get('/admin/purchase-orders/:id', ensureAuthenticated, ensureAdmin, PurchaseOrderController.findOne);
router.post('/admin/purchase-orders', ensureAuthenticated, ensureAdmin, PurchaseOrderController.create);
router.put('/admin/purchase-orders/:id', ensureAuthenticated, ensureAdmin, PurchaseOrderController.patch);
router.patch('/admin/purchase-orders/:id', ensureAuthenticated, ensureAdmin, PurchaseOrderController.patch);
router.delete('/admin/purchase-orders/:id', ensureAuthenticated, ensureAdmin, PurchaseOrderController.remove);
router.post('/admin/purchase-orders/:id/add-order', ensureAuthenticated, ensureAdmin, PurchaseOrderController.addOrder);
router.post('/admin/purchase-orders/:id/remove-order', ensureAuthenticated, ensureAdmin, PurchaseOrderController.removeOrder);
router.post('/admin/purchase-orders/:id/rebuild-request', ensureAuthenticated, ensureAdmin, PurchaseOrderController.rebuildRequest);
router.post('/admin/purchase-orders/:id/send-request', ensureAuthenticated, ensureAdmin, PurchaseOrderController.sendRequest);

router.get('/admin/promo-codes', ensureAuthenticated, ensureAdmin, PromoCodeController.get);
router.get('/admin/promo-codes/:id', ensureAuthenticated, ensureAdmin, PromoCodeController.findOne);
router.post('/admin/promo-codes', ensureAuthenticated, ensureAdmin, PromoCodeController.create);
router.put('/admin/promo-codes/:id', ensureAuthenticated, ensureAdmin, PromoCodeController.patch);
router.patch('/admin/promo-codes/:id', ensureAuthenticated, ensureAdmin, PromoCodeController.patch);
router.delete('/admin/promo-codes/:id', ensureAuthenticated, ensureAdmin, PromoCodeController.remove);

module.exports = router;
