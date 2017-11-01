import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

class PurchaseOrdersListItem extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.delete = this.delete.bind(this);
  }
  delete() {
    this.props.delete(this.props.purchaseOrder);
  }
  renderDeleteAction() {
    if (this.props.purchaseOrder.orders.length === 0) {
      return <span className="left-bumper btn btn-danger btn-xs-true" onClick={this.delete}>Delete</span>;
    }
  }
  render() {
    return (<div className="list-item">
      <span className="right-bumper label label-default">{this.props.purchaseOrder.status}</span>
      {moment(this.props.purchaseOrder.createdAt).fromNow()} - <Link to={`/purchase-orders/${this.props.purchaseOrder._id}`}>
        {this.props.purchaseOrder._id}
      </Link>
      <span className="left-bumper">{this.props.purchaseOrder.orders.length} Orders</span>
      {this.renderDeleteAction()}
    </div>);
  }
}

PurchaseOrdersListItem.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
};

export default PurchaseOrdersListItem;
