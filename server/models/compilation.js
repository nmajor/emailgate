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
  pdf: {},
}, {
  timestamps: true,
});

CompilationSchema.post('save', (doc) => {
  doc.seedPages();
});

CompilationSchema.methods.seedPages = function seedPages() {
  Page.count({ _compilation: this._id })
  .then((count) => {
    if (count === 0) {
      _.forEach(Page.defaultPages(), (pageData) => {
        const newPage = new Page(pageData);
        newPage._compilation = this._id;
        return newPage.save();
      });
    }
  });
};

export default Mongoose.model('Compilation', CompilationSchema);
