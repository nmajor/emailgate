import Account from '../models/account';

export function findOneAccount(req, res) {
  Account.findOne({ _user: req.user._id, _id: req.params.id })
  .then((account) => {
    res.json(account);
  });
}

export function getAccount(req, res) {
  Account.find({ _user: req.user._id })
  .then((accounts) => {
    res.json(accounts);
  });
}

export function createAccount(req, res) {
  const newAccount = new Account(req.body);
  newAccount._user = req.user._id;
  newAccount.save()
  .then((account) => {
    res.json(account);
  });
}

export function patchAccount(req, res) {
  Account.findOne({ _user: req.user._id, _id: req.params.id })
  .then((account) => {
    account.email = req.body.email; // eslint-disable-line no-param-reassign
    account.password = req.body.password; // eslint-disable-line no-param-reassign
    account.host = req.body.host; // eslint-disable-line no-param-reassign
    account.port = req.body.port; // eslint-disable-line no-param-reassign

    return account.save();
  })
  .then((account) => {
    res.json(account);
  });
}

export function removeAccount(req, res) {
  Account.remove({ _user: req.user._id, _id: req.params.id })
  .then((account) => {
    res.json(account);
  });
}
