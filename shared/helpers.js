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

export function pdfsCurrent(pages, emails) {
  return _.every([...pages, ...emails], (component) => {
    if (!component.pdf || !component.pdf.modelVersion) { return false; }

    return component.updatedAt <= component.pdf.modelVersion;
  });
}

export function lastPdfUpdatedAt(pages, emails) {
  const lastComponent = _.sortBy([...pages, ...emails], (component) => {
    if (!component.pdf || !component.pdf.updatedAt) { return null; }

    return component.pdf.updatedAt;
  }).reverse()[0];

  if (!lastComponent.pdf || !lastComponent.pdf.updatedAt) { return null; }
  return lastComponent.pdf.updatedAt;
}

export function sortedEmails(emails) {
  return _.sortBy(emails, 'date');
}

export function sortedPages(pages) {
  return _.sortBy(pages, (page) => { return pageMeta(page).position; });
}

export function sortedComponents(pages, emails) {
  return [...sortedPages(pages), ...sortedEmails(emails)];
}

export function prettyPrice(price) {
  if (!price) { return '0.00'; }
  price = price.toString(); // eslint-disable-line no-param-reassign

  const priceString = `${price.slice(0, -2)}.${price.slice(-2)}`;
  return priceString;
}

export function cartItemsTotal(items, products) {
  const itemSubtotals = _.map(items, (item) => {
    const product = item.product || _.find(products, (prod) => {
      return parseInt(prod._id, 10) === parseInt(item.productId, 10);
    });

    return product.price * item.quantity;
  });

  return _.reduce(itemSubtotals, (sum, subtotal) => { return sum + subtotal; });
}

export function emailPageMap(emails) {
  const mySortedEmails = sortedEmails(emails);
  const pageMap = {};

  let page = 1;
  _.forEach(mySortedEmails, (email) => {
    email.pdf = email.pdf || {}; // eslint-disable-line no-param-reassign
    const pageCount = email.pdf.pageCount || 1;
    pageMap[email._id] = page;
    page += pageCount;
  });

  return pageMap;
}

export function getOrdinalNumber(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function emailEditPath(email) {
  return `compilations/${email._compilation}/build/emails/${email._id}/edit`;
}

export function pageEditPath(page) {
  return `compilations/${page._compilation}/build/pages/${page._id}/edit`;
}
