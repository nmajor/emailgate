import React, { PropTypes, Component } from 'react';
import AddedOrdersListItem from './AddedOrdersListItem';

class AddedOrdersList extends Component { // eslint-disable-line
  renderList() {
    if (this.props.orders.length === 0) {
      return 'No orders added...';
    }

    return this.props.orders.map((order) => {
      return <AddedOrdersListItem key={order._id} order={order} removeOrder={this.props.removeOrder} />;
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
