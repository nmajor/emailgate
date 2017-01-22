import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Order from './order';

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
  discount: { type: Number },
  expiresAt: { type: Date },
  oneTimeUse: { type: Boolean, default: false },
  orders: [{ type: String, ref: 'Order' }],
}, {
  timestamps: true,
});

PromoCodeSchema.pre('save', function (next) { // eslint-disable-line func-names
  this.code = this.code.toLowerCase();
  next();
});

PromoCodeSchema.statics.getCode = function getCode(code) {
  return this.findOne({ code: code.toLowerCase() });
};

PromoCodeSchema.methods.isValid = function isValid() {
  return new Promise((resolve) => {
    const now = new Date();
    if (now > this.expiresAt) {
      return resolve(false);
    }

    if (this.oneTimeUse) {
      return Order.count({ _promoCode: this._id })
      .then((count) => {
        if (count >= 0) {
          return resolve(false);
        }

        return resolve(true);
      });
    }

    return resolve(true);
  });
};

export default Mongoose.model('PromoCode', PromoCodeSchema);
