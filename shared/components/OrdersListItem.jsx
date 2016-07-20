import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { prettyPrice } from '../helpers';

class OrdersListItem extends Component {
  renderItemSummary() {
    return this.props.order.items.map((item) => {
      return (<div>
        <h4>{item.props.compilationName}{item.quantity > 1 ? ` - x${item.quantity}` : ''}</h4>
        <h6>{item.product.desc || item.product.name}</h6>
      </div>);
    });
  }
  render() {
    return (<Link className="orders-list-item" to={`/orders/${this.props.order._id}`}>
      <h4>{moment(this.props.order.createdAt).format('ll')} - ${prettyPrice(this.props.order.amount)}</h4>
      {this.renderItemSummary()}
    </Link>);
  }
}

OrdersListItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrdersListItem;
