import Mongoose, { Schema } from 'mongoose';
import shortid from 'shortid';
import Page from './page';
import _ from 'lodash';

const CompilationSchema = new Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  _user: { type: String, ref: 'User' },
  name: String,
  emails: [{ type: String, ref: 'Email' }],
  pages: [{ type: String, ref: 'Page' }],
});

CompilationSchema.post('save', (doc) => {
  doc.seedPages();
});

CompilationSchema.methods.seedPages = function seedPages() {
  _.forEach(Page.defaultPages(), (pageData) => {
    const newPage = new Page(pageData);
    newPage._compilation = this._id;
    newPage.save();
  });
};

export default Mongoose.model('Compilation', CompilationSchema);
