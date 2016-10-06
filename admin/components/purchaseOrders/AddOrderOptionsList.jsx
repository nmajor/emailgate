import React, { PropTypes, Component } from 'react';
import AddOrderOptionsListItem from './AddOrderOptionsListItem';

class AddOrderOptionsList extends Component { // eslint-disable-line
  renderList() {
    if (this.props.addableOrders.length === 0) {
      return 'No orders to add...';
    }

    return this.props.addableOrders.map((order) => {
      return <AddOrderOptionsListItem key={order._id} order={order} addOrder={this.props.addOrder} />;
    });
  }
  render() {
    return <div>{this.renderList()}</div>;
  }
}

AddOrderOptionsList.propTypes = {
  addableOrders: PropTypes.array.isRequired,
  addOrder: PropTypes.func.isRequired,
};

export default AddOrderOptionsList;
