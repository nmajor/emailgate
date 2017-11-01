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
  const itemAmounts = _.map(items, (item) => {
    let quantity = item.quantity;

    if (item.voucher && item.voucher > 0) {
      quantity = quantity - item.voucher;
    }

    return (item.product.price * quantity);
  });

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
  if (promoCode.kind === 'voucher') { return 0; }

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

  if (cart._promoCode && cart._promoCode.kind === 'voucher' && cart._promoCode.productVouchers.length > 0) {
    const vouchers = [...cart._promoCode.productVouchers];

    _.forEach(cart.items, (item) => {
      const productVoucher = _.remove(vouchers, { productId: item.productId });
      if (productVoucher.length > 0) {
        if (productVoucher[0].quantity > item.quantity) {
          // Add voucher to item
          item.voucher = item.quantity;
          // Add back the unused quantity voucher
          vouchers.push({ productId: item.productId, quantity: productVoucher[0].quantity - item.quantity });
        } else if (productVoucher[0].quantity <= item.quantity) {
          // Add voucher to item
          item.voucher = productVoucher[0].quantity;
        }
      }
    });

    cart.unusedProductVouchers = vouchers;
  }

  cart.discountedAmount = getDiscountedAmount(cart._promoCode, cartItemsTotal(cart.items));
  cart.prettyDiscountedAmount = prettyPrice(cart.discountedAmount);

  cart.itemsTotal = cartItemsTotal(cart.items);
  cart.prettyItemsTotal = prettyPrice(cart.itemsTotal);
  cart.prettyItemsTotal = prettyPrice(cart.itemsTotal);

  cart.total = getCartTotal(cart);
  cart.prettyTotal = prettyPrice(cart.total);

  return cart;
}

export function clientIsMobile() {
  try {
    navigator; // eslint-disable-line
  } catch (e) {
    return false;
  }
  // if (typeof window === 'undefined') { return false; }

  let check = false;
  (function (a) { // eslint-disable-line
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
