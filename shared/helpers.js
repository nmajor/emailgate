import _ from 'lodash';

export function pageMeta(page) {
  const metaMap = {
    cover: {
      desc: 'Cover',
      editable: true,
      position: -4,
    },
    'title-page': {
      desc: 'Title Page',
      editable: true,
      position: -3,
    },
    'message-page': {
      desc: 'Custom Message',
      editable: true,
      position: -2,
    },
    'table-of-contents': {
      desc: 'Table of Contents',
      editable: false,
      position: -1,
    },
  };

  return metaMap[page.type];
}
export function sortedEmails(emails) {
  return _.sortBy(emails, 'date');
}

export function sortedPages(pages) {
  return _.sortBy(pages, (page) => { return pageMeta(page).position; });
}

export function prettyPrice(price) {
  price = price.toString(); // eslint-disable-line no-param-reassign

  const priceString = `${price.slice(0, -2)}.${price.slice(-2)}`;
  return priceString;
}
