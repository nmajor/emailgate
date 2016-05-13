import React, { PropTypes, Component } from 'react';
import OrdersListItem from './OrdersListItem';

class OrdersList extends Component {
  renderOrdersList() {
    if (!this.props.orders.length || this.props.orders.length < 1) {
      return 'No orders';
    }

    return this.props.orders.map((order) => {
      return <OrdersListItem key={order._id} order={order} />;
    });
  }
  render() {
    return (
      <div className="orders-list row">
        <div className="col-md-6">
          {this.renderOrdersList()}
        </div>
      </div>
    );
  }
}

OrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrdersList;
