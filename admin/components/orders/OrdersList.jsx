import React, { PropTypes, Component } from 'react';
import OrdersListItem from './OrdersListItem';

class OrdersList extends Component {
  renderOrdersList() {
    return this.props.orders.map((order) => {
      return <OrdersListItem key={order._id} order={order} />;
    });
  }
  render() {
    return (
      <div className="row">
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
