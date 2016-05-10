import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import { getProductById } from '../util/helpers';
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

CartSchema.methods.addItem = function addItem(itemData) {
  const existingItemIndex = _.findIndex(this.items, (item) => {
    return parseInt(item.productId, 10) === parseInt(itemData.productId, 10) && _.isEqual(item.props, itemData.props);
  });

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += itemData.quantity;
  } else {
    this.items.push(itemData);
  }
};

export default Mongoose.model('Cart', CartSchema);
