import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const AddressSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  firstName: String,
  lastName: String,
  address1: String,
  address2: String,
  city: String,
  region: String,
  postalCode: String,
  phone: String,
}, {
  timestamps: true,
});

export default Mongoose.model('Address', AddressSchema);
