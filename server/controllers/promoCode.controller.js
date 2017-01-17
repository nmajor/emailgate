import PromoCode from '../models/promoCode';

export function findOne(req, res) {
  PromoCode.findOne({ _id: req.params.id })
  .then((promoCode) => {
    res.json(promoCode);
  });
}

export function get(req, res) {
  PromoCode.find({})
  .then((promoCodes) => {
    res.json(promoCodes);
  })
  .catch((err) => {
    console.log(`Error happened. ${err.message}`);
  });
}

export function create(req, res) {
  const newPromoCode = new PromoCode(req.body);
  newPromoCode.save()
  .then((promoCode) => {
    res.json(promoCode);
  });
}

export function patch(req, res) {
  PromoCode.findOne({ _user: req.user._id, _id: req.params.id })
  .then((promoCode) => {
    promoCode.title = req.body.title; // eslint-disable-line no-param-reassign
    promoCode.subtitle = req.body.subtitle; // eslint-disable-line no-param-reassign

    return promoCode.save();
  })
  .then((promoCode) => {
    res.json(promoCode);
  });
}

export function remove(req, res) {
  PromoCode.remove({ _user: req.user._id, _id: req.params.id })
  .then((promoCode) => {
    res.json(promoCode);
  });
}
