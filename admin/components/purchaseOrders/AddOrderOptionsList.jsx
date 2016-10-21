import React, { PropTypes, Component } from 'react';
import AddOrderOptionsListItem from './AddOrderOptionsListItem';

class AddOrderOptionsList extends Component { // eslint-disable-line
  renderActionIcon() {
    return <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>;
  }
  renderList() {
    return this.props.addableOrders.map((order) => {
      return <AddOrderOptionsListItem className="order-thumb" key={order._id} order={order} action={this.props.addOrder} renderActionIcon={this.renderActionIcon} />;
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
