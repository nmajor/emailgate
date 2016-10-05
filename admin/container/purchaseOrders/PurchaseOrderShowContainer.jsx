import React, { PropTypes, Component } from 'react';
import PurchaseOrderView from '../../components/purchaseOrders/PurchaseOrderView';

class PurchaseOrderShowContainer extends Component { // eslint-disable-line
  render() {
    if (!this.props.purchaseOrder) { return <div></div>; }

    return (<div>
      <h1>Purchase Order</h1>
      <PurchaseOrderView purchaseOrder={this.props.purchaseOrder} />
    </div>);
  }
}

PurchaseOrderShowContainer.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderShowContainer;
