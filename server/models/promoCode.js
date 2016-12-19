import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const PromoCodeSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  code: { type: String },
  discountValue: { type: Number },
  discountType: { type: String, default: 'percent' },
  expires: { type: Date },
}, {
  timestamps: true,
});

export default Mongoose.model('PromoCode', PromoCodeSchema);
