import Page from '../models/page';

export function getCompilationPages(req, res) {
  Page.find({ _compilation: req.params.id })
  .then((pages) => {
    res.json(pages);
  });
}
