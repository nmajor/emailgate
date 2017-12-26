import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import PurchaseOrderView from '../../components/purchaseOrders/PurchaseOrderView';

class PurchaseOrderShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.state = {
      addableOrders: [],
    };

    this.addOrder = this.addOrder.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.rebuildRequest = this.rebuildRequest.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }
  componentDidMount() {
    if (this.state.addableOrders.length === 0) {
      this.getAddableOrders();
    }
  }
  getAddableOrders() {
    this.props.dispatch(Actions.queryOrders({ nullPurchaseOrder: true, includeItemProps: true, hasShippingAddress: true }, (addableOrders) => {
      this.setState({ addableOrders });
    }));
  }
  addOrder(orderId) {
    this.props.dispatch(Actions.addOrderToPurchaseOrder(this.props.purchaseOrder._id, orderId, () => {
      this.getAddableOrders();
    }));
  }
  removeOrder(orderId) {
    this.props.dispatch(Actions.removeOrderFromPurchaseOrder(this.props.purchaseOrder._id, orderId, () => {
      this.getAddableOrders();
    }));
  }
  rebuildRequest() {
    this.props.dispatch(Actions.rebuildPurchaseOrderRequest(this.props.purchaseOrder._id));
  }
  sendRequest() {
    if (confirm('Are you sure you are ready to send this request?')) { // eslint-disable-line no-alert
      this.props.dispatch(Actions.sendPurchaseOrderRequest(this.props.purchaseOrder._id));
    }
  }
  render() {
    if (!this.props.purchaseOrder) { return <div></div>; }

    return (<div>
      <h1>Purchase Order</h1>
      <PurchaseOrderView purchaseOrder={this.props.purchaseOrder} addableOrders={this.state.addableOrders} addOrder={this.addOrder} removeOrder={this.removeOrder} rebuildRequest={this.rebuildRequest} sendRequest={this.sendRequest} />
    </div>);
  }
}

PurchaseOrderShowContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.object.isRequired,
};

export default connect()(PurchaseOrderShowContainer);
