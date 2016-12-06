import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const PromoCodeSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  address1: { type: String, required: [true, 'Address is required'] },
  address2: String,
  city: { type: String, required: [true, 'City is required'] },
  region: { type: String, required: [true, 'State is required'] },
  postalCode: { type: String, required: [true, 'Postal code is required'] },
  // country: { type: String, required: [true, 'Country is required'] },
  phone: String,
}, {
  timestamps: true,
});

export default Mongoose.model('PromoCode', PromoCodeSchema);
