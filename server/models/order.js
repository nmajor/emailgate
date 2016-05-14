import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Cart from './cart';
import { getProductById } from '../util/helpers';
import _ from 'lodash';

const OrderItemSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  product: {},
  quantity: { type: Number, required: true },
  props: {},
});

const OrderSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  amount: Number,
  error: {},
  shippingAddress: {},
  // billingAddress: {},
  data: {},
  transaction: {},
  items: [OrderItemSchema],
}, {
  timestamps: true,
});

OrderSchema.virtual('cartId').get(function getCartId() {
  return this._cartId;
});

OrderSchema.virtual('cartId').set(function setCartId(val) {
  this._cartId = val;
  return;
});

OrderSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.getItems()
  .then(() => {
    return this.calculateAmount();
  })
  .then(() => {
    next();
  });
});

OrderSchema.methods.calculateAmount = function calculateAmount() {
  return new Promise((resolve) => {
    const itemAmounts = _.map(this.items, (item) => { return (item.product.price * item.quantity); });

    this.amount = _.reduce(itemAmounts, (sum, amount) => { return sum + amount; });
    resolve(this);
  });
};

OrderSchema.methods.getItems = function getItems() {
  return Cart.findOne({ _id: this.cartId, _user: this._user })
  .then((cart) => {
    const orderItems = cart.items.map((item) => {
      const product = getProductById(item.productId);

      return {
        product,
        quantity: item.quantity,
        props: item.props,
      };
    });

    this.items = orderItems;
    return Promise.resolve(this);
  });
};

OrderSchema.methods.submitPayment = function submitPayment() {
  return new Promise((resolve) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    stripe.charges.create({
      amount: this.amount,
      currency: 'usd',
      source: this.data.stripeToken.id,
      // description: '',
      metadata: { orderId: this._id },
    }, (err, charge) => {
      if (err) {
        this.error = err;
      } else {
        this.transaction = charge;
      }

      resolve(this.save());
    });
  });
};

export default Mongoose.model('Order', OrderSchema);
