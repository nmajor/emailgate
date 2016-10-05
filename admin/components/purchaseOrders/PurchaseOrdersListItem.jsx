import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class PurchaseOrdersListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/purchase-orders/${this.props.purchaseOrder._id}`}>
        {this.props.purchaseOrder._id}
      </Link>
    </div>);
  }
}

PurchaseOrdersListItem.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrdersListItem;
