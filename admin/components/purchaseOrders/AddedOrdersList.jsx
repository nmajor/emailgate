import React, { PropTypes, Component } from 'react';
import OrderThumb from '../orders/OrderThumb';

class AddedOrdersList extends Component { // eslint-disable-line
  renderActionIcon() {
    return <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;
  }
  renderList() {
    return this.props.orders.map((order) => {
      return <OrderThumb className="order-thumb" key={order._id} order={order} action={this.props.removeOrder} renderActionIcon={this.renderActionIcon} />;
    });
  }
  render() {
    return <div>{this.renderList()}</div>;
  }
}

AddedOrdersList.propTypes = {
  orders: PropTypes.array.isRequired,
  removeOrder: PropTypes.func.isRequired,
};

export default AddedOrdersList;
