import _ from 'lodash';
import moment from 'moment';

// function decPrice(price) {
//   return price / 100;
// }

const returnToAddress = {
  Id: 'addr-return',
  City: 'Pleasant Grove',
  Company: 'MYEMAILBOOK.COM',
  Country: 'USA',
  Line1: '1195 N 850 E',
  PostalCode: '84062',
  Province: 'UT',
  ContactLastName: 'Major',
  PhoneNumber: '3852186935',
};

const billToAddress = {
  Id: 'addr-bill',
  City: 'Pleasant Grove',
  Company: 'Nicholas Major',
  Country: 'USA',
  Line1: '1195 N 850 E',
  PostalCode: '84062',
  Province: 'UT',
  ContactLastName: 'Major',
  PhoneNumber: '3852186935',
};

function getPurchaseOrderId(purchaseOrder) {
  return `purc-${purchaseOrder._id}`;
}

function getAddressId(address) {
  return `addr-${address._id}`;
}

function getItemId(compilation) {
  const timestamp = moment(compilation.pdf.updatedAt).unix();
  return `comp-${compilation._id}-${timestamp}`;
}

function requestShipToItems(order) {
  return order.items.map((item) => {
    return {
      ItemId: getItemId(item.props.compilation),
      Qty: item.quantity,
      PackingSlip: {
        ActualSellingPrice: item.product.price,
      },
    };
  });
}

function requestShipTo(order) {
  return {
    AddressId: getAddressId(order.shippingAddress),
    Currency: 'USD',
    Items: requestShipToItems(order),
    Method: 'UPSGSRNA',
    OrgId: '1',
    PackingSlip: {
      Currency: 'USD',
      MessageLine1: 'Thank you for your order',
      MessageLine2: 'Please tell your friends about myemailbook.com',
    },
  };
}

function requestShipTos(orders) {
  return orders.map((order) => {
    return requestShipTo(order);
  });
}

export function requestAddress(address) {
  return {
    Id: getAddressId(address),
    City: address.city,
    Company: `${address.firstName} ${address.lastName}`,
    Country: 'USA',
    Line1: address.address1,
    Line2: address.address2 || undefined,
    PostalCode: address.postalCode,
    Province: address.region,
    ContactLastName: address.lastName,
    PhoneNumber: address.phone,
  };
}

// BookTypeIds
// 4314 - Standard Color 6 x 9 in or 229 x 152 mm Case Laminate on Standard 70 White w/Gloss Lam
// 4414 - Standard Color 6 x 9 in or 229 x 152 mm Case Laminate on Standard 70 White w/Matte Lam

// Thu, 20 Oct 2016 20:09:50 GMT

// YYYY-MM-DD HH:mm:SS

export function requestItem(item) {
  const compilation = item.props.compilation;
  return {
    Id: getItemId(item.props.compilation),
    BindingType: 'Hardcover',
    BookTypeId: 4314,
    BookBlock: {
      FileVersion: moment(compilation.pdf.lastModified, 'ddd, DD MMM YYYY HH:mm:SS zz').format('YYYY-MM-DD HH:mm:SS'),
      Url: compilation.pdf.url,
    },
    Cover: {
      FileVersion: moment(compilation.cover.pdf.lastModified, 'ddd, DD MMM YYYY HH:mm:SS zz').format('YYYY-MM-DD HH:mm:SS'),
      Url: compilation.cover.pdf.url,
    },
    EndSheet: {
      Color: 'White',
      Side: 'Front',
      ThreadColor: 'White',
      Type: 'Single',
    },
    PageCount: compilation.pdf.pageCount,
  };
}

export function requestAddresses(orders) {
  const addresses = orders.map((order) => {
    return requestAddress(order.shippingAddress);
  });
  addresses.push(returnToAddress);
  addresses.push(billToAddress);
  return _.uniqBy(addresses, 'Id');
}

export function requestItems(orders) {
  const items = _.flatten(orders.map((order) => {
    return order.items.map((item) => {
      return requestItem(item);
    });
  }));
  return _.uniqBy(items, 'Id');
}

export function requestOrder(purchaseOrder, orders) {
  return {
    BillToAddressId: 'addr-bill',
    Id: getPurchaseOrderId(purchaseOrder),
    ReturnToAddressId: 'addr-return',
    ServiceLevel: 'SL10',
    ShipTos: requestShipTos(orders),
  };
}

export function buildRequest(purchaseOrder, orders) {
  return {
    Auth: 'AUTH_HERE',
    CustomerId: 'CUSTOMER_ID_HERE',
    PayloadId: getPurchaseOrderId(purchaseOrder),
    Addresses: requestAddresses(orders),
    Items: requestItems(orders),
    Order: requestOrder(purchaseOrder, orders),
  };
}
