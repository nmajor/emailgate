import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class OrdersListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/orders/${this.props.order._id}`}>
        {this.props.order.amount}
      </Link>
    </div>);
  }
}

OrdersListItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrdersListItem;
