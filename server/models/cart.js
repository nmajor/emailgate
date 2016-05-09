import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import { getProductById } from '../util/helpers';

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
  quantity: { type: Number, required: true },
  props: {},
});

const CartSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  items: [CartItemSchema],
}, {
  timestamps: true,
});

CartSchema.statics.findOrNew = function findOrNew(query) {
  return new Promise((resolve) => {
    return this.findOne(query)
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
    return cart.save();
  });
};

export default Mongoose.model('Cart', CartSchema);
