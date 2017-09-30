import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';

const allowedSettings = [
  'designCoverScreencastHelp',
  'addEmailsScreencastHelp',
  'editCompilationScreencastHelp',
  'sitewideSale',
];

const SettingSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  name: {
    type: String,
    validate: {
      validator: (v) => {
        return allowedSettings.indexOf(v) > -1;
      },
      message: '{VALUE} is not a valid setting.',
      required: true,
      unique: true,
    },
  },
  value: {},
}, {
  timestamps: true,
});

export default Mongoose.model('Setting', SettingSchema);
