import React, { PropTypes, Component } from 'react';
import PurchaseOrderView from '../../components/purchaseOrders/PurchaseOrderView';

class PurchaseOrderShowContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Orders</h1>
      <PurchaseOrderView order={this.props.purchaseOrder} />
    </div>);
  }
}

PurchaseOrderShowContainer.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderShowContainer;
