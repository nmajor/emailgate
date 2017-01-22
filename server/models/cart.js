import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import { getProductById, calculateShipping } from '../util/helpers';
import _ from 'lodash';

const CartItemSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  productId: {
    type: String,
    validate: {
      validator: (v) => {
        return !!(getProductById(parseInt(v, 10)));
      },
      message: '{VALUE} is not a valid product id.',
      required: true,
    },
  },
  product: {},
  quantity: { type: Number, required: true },
  props: {},
});

const CartSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  _order: { type: String, ref: 'Order' },
  _promoCode: { type: String, ref: 'PromoCode' },
  shippingEst: Number,
  items: [CartItemSchema],
}, {
  timestamps: true,
});

CartSchema.pre('save', function (next) { // eslint-disable-line func-names
  return this.getEstimatedShipping()
  .then(() => {
    next();
  });
});

CartSchema.methods.getEstimatedShipping = function getEstimatedShipping() {
  return new Promise((resolve) => {
    this.shippingEst = calculateShipping(this.items, this.shippingAddress);
    return resolve(this);
  });
};

CartSchema.statics.findOrNew = function findOrNew(query) {
  return new Promise((resolve) => {
    return this.findCurrent(query)
    .then((cart) => {
      if (cart) {
        resolve(cart);
      } else {
        resolve(new this(query));
      }
    });
  });
};

CartSchema.statics.findOrCreate = function findOrCreate(query) {
  return this.findOrNew(query)
  .then((cart) => {
    if (cart._id) { return Promise.resolve(cart); }

    return cart.save();
  });
};

CartSchema.statics.findCurrent = function findCurrent(query) {
  const newQuery = Object.assign({}, query, { _order: null });

  return this.findOne(newQuery).populate('_promoCode');
};

CartSchema.methods.addItem = function addItem(itemData) {
  const existingItemIndex = _.findIndex(this.items, (item) => {
    return parseInt(item.productId, 10) === parseInt(itemData.productId, 10) && _.isEqual(item.props, itemData.props);
  });

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += parseInt(itemData.quantity, 10);
  } else {
    if (_.isEmpty(itemData.product)) {
      itemData.product = getProductById(parseInt(itemData.productId, 10)); // eslint-disable-line no-param-reassign
    }
    this.items.push(itemData);
  }
};

CartSchema.methods.removeItem = function removeItem(itemId) {
  const cartItemIndex = _.findIndex(this.items, (item) => { return item._id === itemId; });

  if (cartItemIndex > -1) {
    this.items[cartItemIndex].remove();
  }

  return Promise.resolve(this);
};

CartSchema.methods.updateItem = function updateItem(itemId, newData) {
  const cartItemIndex = _.findIndex(this.items, (item) => { return item._id === itemId; });
  if (cartItemIndex > -1) {
    this.items[cartItemIndex].quantity = newData.quantity; // eslint-disable-line no-param-reassign
  }

  return Promise.resolve(this);
};

export default Mongoose.model('Cart', CartSchema);
