import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Cart from './cart';
import { getProductById, calculateShipping } from '../util/helpers';
import _ from 'lodash';

const OrderItemSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  product: {},
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
  quantity: { type: Number, required: true },
  props: {},
});

const OrderSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  shipping: Number,
  tax: Number,
  amount: Number,
  error: {},
  shippingAddress: {},
  billingAddress: {},
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
  return this.build()
  .then(() => {
    next();
  });
});

OrderSchema.methods.build = function build() {
  return this.getItems()
  .then(() => {
    return this.getShipping();
  })
  .then(() => {
    return this.getTax();
  })
  .then(() => {
    return this.getAmount();
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

OrderSchema.methods.getShipping = function getShipping() {
  return (!this.items ? this.getItems() : Promise.resolve(true))
  .then(() => {
    this.shipping = calculateShipping(this.items, this.shippingAddress);
    return Promise.resolve(this);
  });
};

OrderSchema.methods.getTax = function getTax() {
  return (!this.items ? this.getItems() : Promise.resolve(this))
  .then(() => { return (!this.shipping ? this.getShipping() : Promise.resolve(this)); })
  .then(() => {
    const taxjar = require('taxjar')(process.env.TAXJAR_API_KEY); // eslint-disable-line global-require

    const lineItems = this.items.map((item) => {
      return {
        quantity: item.quantity,
        unit_price: (item.product.price / 100),
        product_tax_code: item.product.taxCode,
      };
    });

    return taxjar.taxForOrder({
      to_country: 'US',
      to_zip: this.shippingAddress.postalCode,
      to_state: this.shippingAddress.region,
      amount: (this.amount / 100),
      shipping: (this.shipping / 100),
      line_items: lineItems,
    }).then((res) => {
      if (res.error) {
        this.error = { base: res.detail };
        this.tax = 0;
        return;
      }

      this.tax = parseInt(res.tax.amount_to_collect * 100, 10);
      return Promise.resolve(this);
    });
  });
};

OrderSchema.methods.getAmount = function getAmount() {
  return (!this.items ? this.getItems() : Promise.resolve(this))
  .then(() => { return (!this.shipping ? this.getShipping() : Promise.resolve(this)); })
  .then(() => { return (!this.tax ? this.getTax() : Promise.resolve(this)); })
  .then(() => {
    return new Promise((resolve) => {
      const itemAmounts = _.map(this.items, (item) => { return (item.product.price * item.quantity); });

      const subTotal = _.reduce(itemAmounts, (sum, amount) => { return sum + amount; });
      this.amount = subTotal + this.shipping + this.tax;
      resolve(this);
    });
  });
};

OrderSchema.methods.submitPayment = function submitPayment() {
  return new Promise((resolve) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // eslint-disable-line global-require

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
