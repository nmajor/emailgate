import Compilation from '../models/compilation';
import Page from '../models/page';
import Email from '../models/email';
import _ from 'lodash';
import { userIsAdmin } from '../routes/api.routes';
// import io from '../io';

export function addBlankEmail(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    if (!compilation) { return res.statusCode(400); }

    const newEmail = new Email({ _compilation: compilation._id });
    return newEmail.save();
  })
  .then((email) => {
    res.json(email);
  })
  .catch((err) => { console.log(err); });
}

export function addCustomPage(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    if (!compilation) { return res.statusCode(400); }

    const newPage = new Page({
      _compilation: compilation._id,
      type: req.body.type,
      position: undefined,
    });
    return newPage.save()
    .then((savedPage) => {
      return Page.find({ _compilation: compilation._id })
      .then((pages) => {
        const afterPage = _.find(pages, (page) => { return page._id === req.body.afterId; });

        let tasks = Promise.resolve();

        _.forEach(pages, (page) => {
          if (page._id === savedPage._id) {
            tasks = tasks.then(() => {
              page.position = afterPage.position + 1;
              return page.save();
            });
          } else if (page.position > afterPage.position) {
            tasks = tasks.then(() => {
              page.position = page.position + 1;
              return page.save();
            });
          }
        });

        return tasks;
      });
    })
    .then(() => {
      return Page.find({ _compilation: compilation._id });
    });
  })
  .then((pages) => {
    res.json(pages);
  })
  .catch((err) => { console.log(err); });
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
    if (userIsAdmin(req) && req.query.compilationId) {
      Compilation.find({ _id: req.query.compilationId })
      .then((comps) => {
        res.json(comps);
      });
    } else {
      res.json(compilations);
    }
  })
  .catch((err) => {
    console.log(`Error happened. ${err.message}`);
  });
}

export function createCompilation(req, res) {
  const newCompilation = new Compilation(req.body);
  newCompilation._user = req.user._id;
  newCompilation.meta.creatingUserAgent = req.headers['user-agent'];
  newCompilation.save()
  .then((compilation) => {
    res.json(compilation);
  });
}

export function patchCompilation(req, res) {
  let query = { _user: req.user._id, _id: req.params.id };

  if (userIsAdmin(req)) {
    query = { _id: req.params.id };
  }
  Compilation.findOne(query)
  .then((compilation) => {
    if (req.body.title) { compilation.title = req.body.title || req.body.title; }
    if (req.body.subtitle) { compilation.subtitle = req.body.subtitle || req.body.subtitle; }
    if (req.body.coverTemplate) { compilation.coverTemplate = req.body.coverTemplate || req.body.coverTemplate; }
    if (!_.isEmpty(req.body.newImages)) { compilation.newImages = req.body.newImages; }
    if (!_.isEmpty(req.body.meta)) {
      compilation.meta = { ...compilation.meta, ...req.body.meta };
    }
    if (!_.isEmpty(req.body.coverMeta)) {
      compilation.cover.meta = { ...compilation.cover.meta, ...req.body.coverMeta };
    }

    return compilation.save();
  })
  .then((compilation) => {
    res.json(compilation);
    if (req.body.buildThumbnail) {
      return compilation.buildThumbnail()
      .then((comp) => {
        return comp.save();
      })
      .then((comp) => {
        comp.broadcast();
      });
    }
  })
  .catch((err) => { console.log('An error happened when updating a compilation', err); });
}

export function removeCompilation(req, res) {
  Compilation.findOne({ _user: req.user._id, _id: req.params.id })
  .then((compilation) => {
    return compilation.remove()
    .then(() => {
      res.json(compilation);
    });
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
