import Compilation from '../models/compilation';
import Page from '../models/page';
import Email from '../models/email';

export function addBlankEmail(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    if (!compilation) { return res.statusCode(400); }

    const newEmail = new Email({ _compilation: compilation._id });
    return newEmail.save();
  })
  .then((email) => {
    res.json(email);
  });
}

export function findOneCompilation(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    res.json(compilation);
  });
}

export function getCompilations(req, res) {
  Compilation.find({ _user: req.user._id })
  .then((compilations) => {
    res.json(compilations);
  })
  .catch((err) => {
    console.log(`Error happened. ${err.message}`);
  });
}

export function createCompilation(req, res) {
  const newCompilation = new Compilation(req.body);
  newCompilation._user = req.user._id;
  newCompilation.save()
  .then((compilation) => {
    res.json(compilation);
  });
}

export function patchCompilation(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    compilation.title = req.body.title; // eslint-disable-line no-param-reassign
    compilation.subtitle = req.body.subtitle; // eslint-disable-line no-param-reassign
    compilation.coverTemplate = req.body.coverTemplate; // eslint-disable-line no-param-reassign

    return compilation.save();
  })
  .then((compilation) => {
    res.json(compilation);
  });
}

export function removeCompilation(req, res) {
  Compilation.remove({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    res.json(compilation);
  });
}

export function patchCompilationPage(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then(compilation => Page.findOne({ _compilation: compilation._id, _id: res.body.page._id }))
  .then((page) => {
    page.content = res.body.content; // eslint-disable-line no-param-reassign
    return page.save();
  })
  .then((page) => {
    res.json(page);
  });
}
