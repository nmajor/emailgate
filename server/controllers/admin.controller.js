import _ from 'lodash';
import User from '../models/user';
import Compilation from '../models/compilation';
import Order from '../models/order';
import Email from '../models/email';
import Page from '../models/page';
import Setting from '../models/setting';

export function getUsers(req, res) {
  User.find({})
  .then((users) => {
    res.json(users);
  });
}

export function getCompilations(req, res) {
  Compilation.find({})
  .sort({ updatedAt: -1 })
  .limit(100)
  .populate('pages _user')
  .then((compilations) => {
    res.json(compilations);
  });
}

export function getCompilation(req, res) {
  Compilation.findOne({ _id: req.params.id })
  .populate('pages _user')
  .then((compilation) => {
    res.json(compilation);
  });
}

export function getSettings(req, res) {
  Setting.find({})
  .then((settings) => {
    res.json(settings);
  });
}

export function updateSetting(req, res) {
  Setting.findOne({ name: req.params.name })
  .then((setting) => {
    if (!setting) {
      setting = new Setting({ name: req.params.name });
    }
    setting.value = req.body;
    return setting.save();
  })
  .then(() => {
    return Setting.find({});
  })
  .then((settings) => {
    res.json(settings);
  })
  .catch((err) => { console.log('An error happened when trying to update a setting', err); });
}

export function patchCompilation(req, res) {
  Compilation.findOne({ _id: req.params.id })
  .then((compilation) => {
    compilation.title = req.body.title || compilation.title; // eslint-disable-line no-param-reassign
    compilation.subtitle = req.body.subtitle || compilation.subtitle; // eslint-disable-line no-param-reassign
    compilation.cover.spineWidth = _.get(req.body, 'cover.spineWidth') || compilation.cover.spineWidth; // eslint-disable-line no-param-reassign

    return compilation.save();
  })
  .then((compilation) => {
    res.json(compilation);
  })
  .catch((err) => { console.log('an error happened patching a compilation', err); });
}

export function getOrders(req, res) {
  const query = {};

  if (req.query.nullPurchaseOrder) { query._purchaseOrder = { $eq: null }; }
  if (req.query.hasShippingAddress) { query.shippingAddress = { $ne: [{}, null] }; }

  new Promise((resolve) => {
    if (req.query.includeItemProps) {
      return resolve(Order.findAndBuildItemProps(query));
    }

    return resolve(Order.find(query));
  })
  .then((orders) => {
    res.json(orders);
  });
}

export function findEmail(req, res) {
  Email.findOne({ _id: req.params.id })
  .then((email) => {
    res.json(email);
  });
}

export function findPage(req, res) {
  Page.findOne({ _id: req.params.id })
  .then((page) => {
    res.json(page);
  });
}
