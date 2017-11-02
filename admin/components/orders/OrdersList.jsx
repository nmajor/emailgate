import React, { PropTypes, Component } from 'react';
import OrderThumb from './OrderThumb';
import _ from 'lodash';

class OrdersList extends Component {
  renderOrdersList() {
    return _.sortBy(this.props.orders, (o) => { return -new Date(o.createdAt).getTime(); }).map((order) => {
      return <OrderThumb className="order-thumb" key={order._id} order={order} />;
    });
  }
  render() {
    return <div>{this.renderOrdersList()}</div>;
  }
}

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrdersList;
