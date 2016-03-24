import Compilation from '../models/compilation';

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
    compilation.name = req.body.email; // eslint-disable-line no-param-reassign

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
