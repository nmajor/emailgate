import React, { PropTypes, Component } from 'react';
import AddedOrdersList from './AddedOrdersList';
import AddOrderOptionsList from './AddOrderOptionsList';
import PurchaseOrderSummary from './PurchaseOrderSummary';
import PurchaseOrderRequest from './PurchaseOrderRequest';

class PurchaseOrderView extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.state = {
      resultsExpanded: false,
    };
  }
  render() {
    return (<div>
      <div>
        <h3>Summary</h3>
        <PurchaseOrderSummary purchaseOrder={this.props.purchaseOrder} />
      </div>
      <div>
        <h3>Added Orders</h3>
        <AddedOrdersList orders={this.props.purchaseOrder.orders} removeOrder={this.props.removeOrder} />
      </div>
      <div>
        <h3>Addable Orders</h3>
        <AddOrderOptionsList addableOrders={this.props.addableOrders} addOrder={this.props.addOrder} />
      </div>
      <div>
        <h3>Request</h3>
        <PurchaseOrderRequest purchaseOrder={this.props.purchaseOrder} />
      </div>
    </div>);
  }
}

PurchaseOrderView.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
  addableOrders: PropTypes.array.isRequired,
  addOrder: PropTypes.func.isRequired,
  removeOrder: PropTypes.func.isRequired,
};

export default PurchaseOrderView;
