import _ from 'lodash';

export function pageMeta(page) {
  const metaMap = {
    cover: {
      desc: 'Cover',
      editable: true,
      position: 1,
    },
    'title-page': {
      desc: 'Title Page',
      editable: true,
      position: 2,
    },
    'message-page': {
      desc: 'Custom Message Page',
      editable: true,
      position: 3,
    },
    'full-image-page': {
      desc: 'Full Image Page',
      editable: true,
      position: 3,
    },
    'table-of-contents': {
      desc: 'Table of Contents',
      editable: false,
      position: 4,
    },
  };

  return metaMap[page.type] || {};
}

export function isPageEditable(page) {
  const nonEditable = [
    'table-of-contents',
    'title-page',
    'cover',
  ];

  if (nonEditable.indexOf(page.type) > -1) {
    return false;
  }

  return true;
}

export function titleize(str) {
  return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

export function pdfPath(pdf) {
  return pdf.path.replace('/nmajor/', '/files/');
}

export function pdfsCurrent(pages, emails) {
  return _.every([...pages, ...emails], (component) => {
    if (!component.pdf || !component.pdf.modelVersion) { return false; }

    return component.updatedAt <= component.pdf.modelVersion;
  });
}

export function withObsoletePdf(pages, emails) {
  return _.filter([...pages, ...emails], (component) => { // eslint-disable-line no-param-reassign
    if (!component.pdf || !component.pdf.updatedAt || !component.pdf.modelVersion) { return true; }

    return component.updatedAt > component.pdf.modelVersion;
  });
}

export function lastPdfUpdatedAt(pages, emails) {
  const sorted = _.sortBy([...pages, ...emails], (component) => {
    if (!component.pdf || !component.pdf.updatedAt) { return null; }

    return component.pdf.updatedAt;
  }).reverse().filter((component) => {
    if (!component.pdf || !component.pdf.updatedAt) { return false; }
    return true;
  });

  const lastComponent = sorted[0];

  if (!lastComponent || !lastComponent.pdf || !lastComponent.pdf.updatedAt) { return null; }
  return lastComponent.pdf.updatedAt;
}

export function sortedEmails(emails) {
  return _.sortBy(emails, (email) => { return email.date; });
}

export function sortedPages(pages) {
  return _.sortBy(pages, (page) => { return page.position || pageMeta(page).position; });
}

export function sortedComponents(pages, emails) {
  return [...sortedPages(pages), ...sortedEmails(emails)];
}

export function prettyPrice(price) {
  if (!price) { return '0.00'; }
  price = price.toString(); // eslint-disable-line no-param-reassign

  return `${price.slice(0, -2)}.${price.slice(-2)}`;
}

export function prettyIntegerPrice(price) {
  if (!price) { return '0'; }
  price = price.toString(); // eslint-disable-line no-param-reassign

  return price.slice(0, -2);
}

export function cartItemsTotal(items) {
  const itemAmounts = _.map(items, (item) => { return (item.product.price * item.quantity); });
  return _.reduce(itemAmounts, (sum, amount) => { return sum + amount; });
}

export function emailPageMap(emails) {
  const mySortedEmails = sortedEmails(emails);
  const pageMap = {};

  let page = 1;
  _.forEach(mySortedEmails, (email) => {
    email.pdf = email.pdf || {}; // eslint-disable-line no-param-reassign
    const pageCount = email.pdf.pageCount || email.estimatedPageCount;
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

export function compilationTotalPageCountEstimate(compilation) {
  let emailPdfPages = _.get(compilation, 'meta.estimatedEmailPdfPages');
  let pagePdfPages = _.get(compilation, 'meta.estimatedPagePdfPages');

  emailPdfPages = emailPdfPages || compilation.emails.map(() => { return 3; }).reduce((pre, cur) => { return pre + cur; }, 0);
  pagePdfPages = pagePdfPages || compilation.pages.map(() => { return 1; }).reduce((pre, cur) => { return pre + cur; }, 0);

  return emailPdfPages + pagePdfPages;
}

function actionReadyMap(compilation, emails, pages) {
  function addEmailsReady() {
    return true;
  }

  function buildReady() {
    return emails.length > 0;
  }

  function previewReady() {
    return _.every(pages.map((page) => {
      if (page.type === 'table-of-contents') { return true; }

      return page.createdAt !== page.updatedAt;
    }));
  }

  function checkoutReady() {
    const latestPdf = lastPdfUpdatedAt(pages, emails);

    return compilation.approvedAt >= latestPdf;
  }

  return {
    'add-emails': addEmailsReady(),
    build: buildReady(),
    preview: previewReady(),
    checkout: checkoutReady(),
  };
}

export function actionStatusMap(compilation, emails, pages) {
  const readyMap = actionReadyMap(compilation, emails, pages);

  function addEmailsStatus() {
    return 'ready';
  }

  function buildStatus() {
    if (readyMap.build && !readyMap.preview && !readyMap.checkout) {
      return 'loud';
    }

    return readyMap.build ? 'ready' : 'disabled';
  }

  function previewStatus() {
    if (readyMap.preview && !readyMap.checkout) {
      return 'loud';
    }

    return readyMap.preview ? 'ready' : 'disabled';
  }

  function checkoutStatus() {
    return readyMap.checkout ? 'loud' : 'disabled';
  }

  return {
    'add-emails': addEmailsStatus(),
    build: buildStatus(),
    preview: previewStatus(),
    checkout: checkoutStatus(),
  };
}

export function colWrapperClass() {
  return 'col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3';
}

export function serializeQuery(obj) {
  const str = [];
  _.forEach(obj, (v, k) => {
    str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  });
  return str.join('&');
}

export function getDiscountedAmount(promoCode, amount) {
  if (!promoCode) { return 0; }

  return amount * (promoCode.discount / 100);
}

export function applyPromoCodeToAmount(promoCode, amount) {
  if (!promoCode) { return amount; }

  return amount - (getDiscountedAmount(promoCode, amount));
}

export function rotateImage(imgSrc, degrees, cb) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.crossOrigin = 'Anonymous';

  image.src = imgSrc;
  image.onload = () => {
    canvas.width = image.height;
    canvas.height = image.width;
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(0, -canvas.width);
    ctx.drawImage(image, 0, 0);

    cb(canvas.toDataURL());
  };
}

export function getCoverImage(compilation, key) {
  const imageMeta = _.get(compilation, `cover.meta.${key}`);
  if (!imageMeta) { return undefined; }

  const image = _.find(compilation.images, (img) => { return img._id === imageMeta.imageId; });

  return { ...image, ...imageMeta };
}

export function getCartTotal(cart) {
  if (cart.amount) {
    return cart.amount;
  }

  let amount = cartItemsTotal(cart.items);
  if (cart.shipping) {
    amount += cart.shipping;
  } else if (cart.shippingEst) {
    amount += cart.shippingEst;
  }

  if (cart.tax) {
    amount += cart.tax;
  }

  if (cart._promoCode) {
    amount -= getDiscountedAmount(cart._promoCode, cartItemsTotal(cart.items));
  }

  return amount;
}

export function buffCart(cart, compilations, products) {
  _.forEach(cart.items, (item) => {
    item.props.compilation = _.find(compilations, (compilation) => { return compilation._id === item.props.compilationId; });
  });

  if (products) {
    _.forEach(cart.items, (item) => {
      item.product = _.find(products, (product) => { return product._id === parseInt(item.productId, 10); });
      item.product.prettyPrice = prettyPrice(item.product.price);
    });
  }

  cart.discountedAmount = getDiscountedAmount(cart._promoCode, cartItemsTotal(cart.items));
  cart.prettyDiscountedAmount = prettyPrice(cart.discountedAmount);

  cart.itemsTotal = cartItemsTotal(cart.items);
  cart.prettyItemsTotal = prettyPrice(cart.itemsTotal);

  cart.total = getCartTotal(cart);
  cart.prettyTotal = prettyPrice(cart.total);

  return cart;
}
