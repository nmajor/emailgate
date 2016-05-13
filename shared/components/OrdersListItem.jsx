import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class OrdersListItem extends Component {
  render() {
    return (<Link className="orders-list-item" to={`/orders/${this.props.order._id}`}>
      {this.props.order._id}
    </Link>);
  }
}

OrdersListItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrdersListItem;
