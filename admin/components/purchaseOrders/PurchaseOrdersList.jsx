import React, { PropTypes, Component } from 'react';
import PurchaseOrdersListItem from './PurchaseOrdersListItem';
import _ from 'lodash';

class PurchaseOrdersList extends Component {
  renderOrdersList() {
    return _.sortBy(this.props.purchaseOrders, (po) => { return -new Date(po.createdAt).getTime(); }).map((purchaseOrder) => {
      return <PurchaseOrdersListItem key={purchaseOrder._id} purchaseOrder={purchaseOrder} delete={this.props.deletePurchaseOrder} />;
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

PurchaseOrdersList.propTypes = {
  purchaseOrders: PropTypes.array.isRequired,
  deletePurchaseOrder: PropTypes.func.isRequired,
};

export default PurchaseOrdersList;
