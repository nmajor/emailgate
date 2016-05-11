import Address from '../models/address';

export function findOneAddress(req, res) {
  Address.findOne({ _user: req.user._id, _id: req.params.id })
  .then((address) => {
    res.json(address);
  });
}

export function getAddresses(req, res) {
  Address.find({ _user: req.user._id })
  .then((addresses) => {
    res.json(addresses);
  });
}

export function createAddress(req, res) {
  const newAddress = new Address(req.body);
  newAddress._user = req.user._id;
  newAddress.save()
  .then((address) => {
    res.json(address);
  });
}

export function patchAddress(req, res) {
  Address.findOne({ _user: req.user._id, _id: req.params.id })
  .then((address) => {
    address.imap = req.body.imap; // eslint-disable-line no-param-reassign

    return address.save();
  })
  .then((address) => {
    res.json(address);
  });
}

export function removeAddress(req, res) {
  Address.remove({ _user: req.user._id, _id: req.params.id })
  .then((address) => {
    res.json(address);
  });
}
