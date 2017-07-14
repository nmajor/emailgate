import Page from '../models/page';
import Compilation from '../models/compilation';

export function getCompilationPages(req, res) {
  console.log('blah getCompilationPages');
  Page.find({ _compilation: req.params.id })
  .then((pages) => {
    if (pages.length > 0) {
      return res.json(pages);
    }

    return Compilation.findOne({ _id: req.params.id })
    .then((compilation) => {
      return compilation.seedPages();
    })
    .then(() => {
      return Page.find({ _compilation: req.params.id });
    })
    .then((newPages) => {
      return res.json(newPages);
    })
    .catch((err) => { console.log('An error happened', err); });
  })
  .catch((err) => { console.log('An error happened when finding compilation pages', err); });
}
