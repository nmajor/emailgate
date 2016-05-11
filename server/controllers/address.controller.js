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
    address.firstName = req.body.firstName; // eslint-disable-line no-param-reassign
    address.lastName = req.body.lastName; // eslint-disable-line no-param-reassign
    address.address1 = req.body.address1; // eslint-disable-line no-param-reassign
    address.address2 = req.body.address2; // eslint-disable-line no-param-reassign
    address.city = req.body.city; // eslint-disable-line no-param-reassign
    address.region = req.body.region; // eslint-disable-line no-param-reassign
    address.postalCode = req.body.postalCode; // eslint-disable-line no-param-reassign
    address.phone = req.body.phone; // eslint-disable-line no-param-reassign

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
