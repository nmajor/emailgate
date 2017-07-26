import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Cart from './cart';
import PromoCode from './promoCode';
import Compilation from './compilation';
import { getProductById, calculateShipping } from '../util/helpers';
import { getDiscountedAmount, applyPromoCodeToAmount } from '../../shared/helpers';
import _ from 'lodash';

function buildItemProps(item) {
  return Compilation.findOne({ _id: item.props.compilationId })
  .then((compilation) => {
    item.props.compilation = compilation; // eslint-disable-line no-param-reassign
    return Promise.resolve(item);
  });
}

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
  _purchaseOrder: { type: String, ref: 'PurchaseOrder' },
  _promoCode: { type: String, ref: 'PromoCode' },
  shipping: Number,
  tax: Number,
  discount: Number,
  subtotal: Number,
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

OrderSchema.statics.findAndBuildItemProps = function findAndBuildItemProps(query) {
  return this.find(query)
  .then((orders) => {
    return Promise.all(orders.map((order) => {
      order = order.toJSON(); // eslint-disable-line no-param-reassign
      return Promise.all(order.items.map((item) => {
        return buildItemProps(item);
      }))
      .then((items) => {
        order.items = items; // eslint-disable-line no-param-reassign
        return Promise.resolve(order);
      });
    }));
  });
};

OrderSchema.methods.build = function build() {
  return this.syncCart()
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

OrderSchema.methods.syncCart = function syncCart() {
  return Cart.findOne({ _id: this.cartId, _user: this._user }).populate('_promoCode')
  .then((cart) => {
    const orderItems = cart.items.map((item) => {
      const product = getProductById(item.productId);

      return {
        product,
        productId: item.productId,
        quantity: item.quantity,
        props: item.props,
      };
    });

    this.items = orderItems;
    this._promoCode = this._promoCode || cart._promoCode;
    return Promise.resolve(this);
  });
};

OrderSchema.methods.getShipping = function getShipping() {
  return (!this.items ? this.syncCart() : Promise.resolve(true))
  .then(() => {
    return new Promise((resolve) => {
      if (!_.isEmpty(this._promoCode)) {
        const promoCodeId = typeof this._promoCode === 'string' ? this._promoCode : this._promoCode._id;
        PromoCode.findOne({ _id: promoCodeId })
        .then((promoCode) => {
          return promoCode.isValid()
          .then((isValid) => {
            if (isValid && promoCode.freeShipping) {
              this.shipping = 0;
              this._promoCode = promoCode;
              return resolve(this);
            }

            this.shipping = calculateShipping(this.items, this.shippingAddress);
            return resolve(this);
          });
        });
      } else {
        this.shipping = calculateShipping(this.items, this.shippingAddress);
        return resolve(this);
      }
    });
  });
};

OrderSchema.methods.getTax = function getTax() {
  return (!this.items ? this.syncCart() : Promise.resolve(this))
  .then(() => { return (this.discount === undefined ? this.getDiscount() : Promise.resolve(this)); })
  .then(() => { return this.getSubtotal(); })
  .then(() => { return (!this.shipping ? this.getShipping() : Promise.resolve(this)); })
  .then(() => {
    const taxjar = require('taxjar')(process.env.TAXJAR_API_KEY); // eslint-disable-line global-require

    const lineItems = this.items.map((item) => {
      return {
        quantity: item.quantity,
        unit_price: (applyPromoCodeToAmount(this._promoCode, item.product.price) / 100),
        product_tax_code: item.product.taxCode,
      };
    });

    return taxjar.taxForOrder({
      to_country: 'US',
      to_zip: this.shippingAddress.postalCode,
      to_state: this.shippingAddress.region,
      amount: (this.subtotal / 100),
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
  return (!this.items ? this.syncCart() : Promise.resolve(this))
  .then(() => { return this.getDiscount(); })
  .then(() => { return this.getSubtotal(); })
  .then(() => { return (!this.shipping ? this.getShipping() : Promise.resolve(this)); })
  .then(() => { return (!this.tax ? this.getTax() : Promise.resolve(this)); })
  .then(() => {
    return new Promise((resolve) => {
      this.amount = this.subtotal + this.shipping + this.tax;
      resolve(this);
    });
  });
};

OrderSchema.methods.getSubtotal = function getSubtotal() {
  const itemTotal = this.getItemTotal();
  this.subtotal = itemTotal - this.discount;
  return Promise.resolve(this);
};

OrderSchema.methods.getItemTotal = function getItemTotal() {
  const itemAmounts = _.map(this.items, (item) => { return (item.product.price * item.quantity); });
  return _.reduce(itemAmounts, (sum, amount) => { return sum + amount; });
};


OrderSchema.methods.getDiscount = function getDiscount() {
  return new Promise((resolve) => {
    const itemTotal = this.getItemTotal();

    if (!this._promoCode) { this.discount = 0; return resolve(this); }
    const promoCodeId = typeof this._promoCode === 'string' ? this._promoCode : this._promoCode._id;

    PromoCode.findOne({ _id: promoCodeId })
    .then((promoCode) => {
      return promoCode.isValid()
      .then((isValid) => {
        if (isValid) {
          this.discount = getDiscountedAmount(this._promoCode, itemTotal);
          this._promoCode = promoCode;
          return resolve(this);
        }

        this.discount = 0;
        return resolve(this);
      });
    });
  });
};

OrderSchema.methods.submitPayment = function submitPayment() {
  return new Promise((resolve) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // eslint-disable-line global-require

    if (this.amount > 0) {
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
    } else {
      this.transaction = { amountZero: true };
      resolve(this.save());
    }
  });
};

export default Mongoose.model('Order', OrderSchema);
