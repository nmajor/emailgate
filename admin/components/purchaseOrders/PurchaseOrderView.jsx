import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import AddedOrdersList from './AddedOrdersList';
import AddOrderOptionsList from './AddOrderOptionsList';
import PurchaseOrderSummary from './PurchaseOrderSummary';
import PurchaseOrderRequest from './PurchaseOrderRequest';
import PurchaseOrderResponse from './PurchaseOrderResponse';

class PurchaseOrderView extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.state = {
      resultsExpanded: false,
    };
  }
  renderOrders() {
    if (this.props.purchaseOrder.orders.length > 0) {
      return (<AddedOrdersList orders={this.props.purchaseOrder.orders} removeOrder={this.props.removeOrder} />);
    }

    return 'No orders added...';
  }
  renderAddOrders() {
    if (!this.props.purchaseOrder.sentAt) {
      let content = 'No orders to add...';
      if (this.props.purchaseOrder.orders.length > 0 || this.props.addableOrders.length > 0) {
        content = (<AddOrderOptionsList addableOrders={this.props.addableOrders} addOrder={this.props.addOrder} />);
      }

      return (<div>
        <h3>Add Orders</h3>
        {content}
      </div>);
    }
  }
  renderSendAction() {
    if (this.props.purchaseOrder.orders.length === 0) { return null; }

    if (this.props.purchaseOrder.sentAt) {
      return (<div className="top-bumper">
        <button className="btn btn-success btn-block disabled" onClick={this.props.sendRequest}>Sent at {moment(this.props.purchaseOrder.sentAt).format('LL')}</button>
      </div>);
    }

    return (<div className="top-bumper">
      <button className="btn btn-success btn-block" onClick={this.props.sendRequest}>Send Request</button>
    </div>);
  }
  renderResponses() {
    if (this.props.purchaseOrder.sentAt) {
      return (<div>
        <h3>Responses</h3>
        <PurchaseOrderResponse purchaseOrder={this.props.purchaseOrder} />
      </div>);
    }
  }
  render() {
    return (<div className="row">
      <div className="col-md-6">
        <div>
          <PurchaseOrderSummary purchaseOrder={this.props.purchaseOrder} />
          {this.renderSendAction()}
        </div>
        <div>
          <h3>Orders</h3>
          {this.renderOrders()}
        </div>
        <div>
          <h3>Request <span className="btn btn-default btn-xs-true"><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></span></h3>
          <PurchaseOrderRequest purchaseOrder={this.props.purchaseOrder} />
        </div>
      </div>
      <div className="col-md-6">
        {this.renderAddOrders()}
        {this.renderResponses()}
      </div>
    </div>);
  }
}

PurchaseOrderView.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
  addableOrders: PropTypes.array.isRequired,
  addOrder: PropTypes.func.isRequired,
  removeOrder: PropTypes.func.isRequired,
  rebuildRequest: PropTypes.func.isRequired,
  sendRequest: PropTypes.func.isRequired,
};

export default PurchaseOrderView;
