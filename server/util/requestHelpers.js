function getAddressId(address) {
  console.log('blah getAddressId');
  return `addr-${address._id}`;
}

function getItemId(compilation) {
  console.log('blah getItemId');
  return `comp-${compilation._id}`;
}

function requestShipToItems(order) {
  return order.items.map((item) => {
    return {
      ItemId: getItemId(item.props.compilation),
      Qty: item.quantity,
    };
  });
}

function requestShipTo(order) {
  console.log('blah requestShipTo', order.shippingAddress);
  return {
    AddressId: getAddressId(order.shippingAddress),
    CarrierAccountNumber: '',
    Currency: 'USD',
    EndCustomerId: '',
    Items: requestShipToItems(order),
    Method: '',
    OrgId: '',
    PackingSlip: {
      Currency: '',
      MessageLine1: 'Thank you for your order',
      Terms: '',
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
    Company: '',
    Country: '',
    Line1: '',
    Line2: '',
    PostalCode: '',
    Province: '',
  };
}

export function requestItem(item) {
  console.log('blah requestItem 1', item);
  const compilation = item.props.compilation;
  console.log('blah requestItem 2', compilation);
  return {
    Id: getItemId(item.props.compilation),
    BookBlock: {
      FileVersion: '2007-05-30 11:47:15',
      Url: compilation.pdf.url,
    },
    Cover: {
      FileVersion: '2007-05-30 11:47:15',
      Url: compilation.pdf.url,
      Color: 'Red',
    },
    PageCount: compilation.pdf.pageCount,
  };
}

export function requestAddresses(orders) {
  return orders.map((order) => {
    console.log('blah requestAddresses', order.shippingAddress);
    return requestAddress(order.shippingAddress);
  });
}

export function requestItems(orders) {
  return orders.map((order) => {
    return order.items.map((item) => {
      return requestItem(item);
    });
  });
}

export function requestOrder(purchaseOrder, orders) {
  return {
    BillToAddressId: '',
    Id: '',
    OrderReference1: '',
    ReturnToAddressId: '',
    ServiceLevel: '',
    ShipTos: requestShipTos(orders),
  };
}

export function buildRequest(purchaseOrder, orders) {
  console.log('blah buildRequest', orders);
  return {
    Auth: '',
    CustomerId: '',
    PayloadId: '',
    Addresses: requestAddresses(orders),
    Items: requestItems(orders),
    Order: requestOrder(purchaseOrder, orders),
  };
}
