import Compilation from '../models/compilation';
import Order from '../models/order';
import User from '../models/user';

export function getActivitySummaryData() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayStart = new Date(yesterday.getTime());
  yesterdayStart.setHours(0, 0, 0, 0);

  const yesterdayEnd = new Date(yesterday.getTime());
  yesterdayEnd.setHours(23, 59, 59, 999);

  return Promise.all([
    Compilation.find({ updatedAt: { $gte: yesterdayStart, $lt: yesterdayEnd } }).populate('_user'),
    User.find({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } }),
    Order.find({ createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd } }),
  ])
  .then((results) => {
    return {
      compilations: results[0],
      users: results[1],
      orders: results[2],
      yesterday,
      yesterdayStart,
      yesterdayEnd,
    };
  });
}
