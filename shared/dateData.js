import _ from 'lodash';

export const days = _.range(1, 32);

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const years = _.range(new Date().getFullYear(), 1980);
