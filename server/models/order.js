import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
// import { getProductById } from '../util/helpers';

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
  status: {
    code: String,
    message: String,
  },
  shippingAddress: {},
  paymentInfo: {},
  transactionInfo: {},
  items: [OrderItemSchema],
}, {
  timestamps: true,
});

OrderSchema.methods.submitPayment = function submitPayment() {
  return new Promise((resolve, reject) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    stripe.charges.create({
      amount: this.amount,
      currency: 'usd',
      source: this.paymentInfo,
      // description: '',
      metadata: { orderId: this._id },
    }, (err, charge) => {
      if (err && err.type === 'StripeCardError') {
        reject(err);
        // The card has been declined
      }

      this.transactionInfo = charge;
      resolve(this.save());
    });
    resolve();
  });
};

export default Mongoose.model('Order', OrderSchema);
