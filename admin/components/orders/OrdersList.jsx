import React, { PropTypes, Component } from 'react';
import OrderThumb from './OrderThumb';

class OrdersList extends Component {
  renderOrdersList() {
    return this.props.orders.map((order) => {
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
