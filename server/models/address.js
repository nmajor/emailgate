import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const AddressSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: String,
}, {
  timestamps: true,
});

export default Mongoose.model('Address', AddressSchema);
