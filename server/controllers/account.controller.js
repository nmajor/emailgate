import Account from '../models/account';

export function findOneAccount(req, res) {
  Account.findOne({ _user: req.user._id, _id: req.params.id })
  .then((account) => {
    res.json(account);
  });
}

export function getAccounts(req, res) {
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
    account.authProps = req.body.authProps; // eslint-disable-line no-param-reassign

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
