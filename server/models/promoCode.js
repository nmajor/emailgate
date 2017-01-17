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

PromoCodeSchema.methods.isValid = function isValid() {
  return new Promise((resolve, reject) => {
    const now = new Date();
    if (now > this.expiresAt) {
      return reject('This code is no longer valid.');
    }

    if (this.oneTimeUse) {
      return Order.count({ _promoCode: this._id })
      .then((count) => {
        if (count >= 0) {
          return reject('This code is no longer valid.');
        }

        return resolve(true);
      });
    }

    return resolve(true);
  });
};

export default Mongoose.model('PromoCode', PromoCodeSchema);
