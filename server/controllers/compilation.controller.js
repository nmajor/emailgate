import Compilation from '../models/compilation';

export function findOne(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    res.json(compilation);
  });
}

export function get(req, res) {
  Compilation.find({ _user: req.user._id })
  .then((compilations) => {
    res.json(compilations);
  });
}

export function create(req, res) {
  const newCompilation = new Compilation(req.body);
  newCompilation._user = req.user._id;
  newCompilation.save()
  .then((compilation) => {
    res.json(compilation);
  });
}

export function patch(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    compilation.email = req.body.email; // eslint-disable-line no-param-reassign
    compilation.password = req.body.password; // eslint-disable-line no-param-reassign
    compilation.host = req.body.host; // eslint-disable-line no-param-reassign
    compilation.port = req.body.port; // eslint-disable-line no-param-reassign

    return compilation.save();
  })
  .then((compilation) => {
    res.json(compilation);
  });
}

export function remove(req, res) {
  Compilation.remove({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    res.json(compilation);
  });
}
