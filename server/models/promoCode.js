import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Order from './order';
import VoucherWelcome from '../mailers/VoucherWelcome';
import { sendMail } from '../util/mail';

function generateCode() {
  let text = '';
  const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 8; i++) {
    text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  return text;
}

const PromoCodeSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  code: { type: String, unique: true, default: generateCode },
  kind: {
    type: String,
    validate: {
      validator: (v) => {
        return ['discount', 'voucher'].indexOf(v) > -1;
      },
    },
  },
  productVouchers: [{ productId: String, quantity: Number }],
  discount: { type: Number },
  expiresAt: { type: Date },
  oneTimeUse: { type: Boolean, default: false },
  freeShipping: { type: Boolean, default: false },
  orders: [{ type: String, ref: 'Order' }],
  email: { type: String },
}, {
  timestamps: true,
});

PromoCodeSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.code = this.code.toLowerCase();
  next();
});

PromoCodeSchema.statics.findByCode = function findByCode(code) {
  return this.findOne({ code: code.toLowerCase() });
};

PromoCodeSchema.methods.isValid = function isValid() {
  return new Promise((resolve) => {
    const now = new Date();
    if (this.expiresAt && now > this.expiresAt) {
      return resolve(false);
    }

    if (this.oneTimeUse) {
      return Order.count({ _promoCode: this._id })
      .then((count) => {
        if (count > 0) {
          return resolve(false);
        }

        return resolve(true);
      });
    }

    return resolve(true);
  });
};

PromoCodeSchema.methods.deliverToEmail = function deliverToEmail() {
  return new Promise((resolve) => {
    const mailer = new VoucherWelcome({ promoCode: this });

    const data = {
      from: 'Missionary Memoir <hello@missionarymemoir.com>',
      to: this.email,
      subject: 'Your Missionary Memoir Gift Card',
      html: mailer.toString(),
    };

    sendMail(data);
    resolve(this);
  });
};

export default Mongoose.model('PromoCode', PromoCodeSchema);
