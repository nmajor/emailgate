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
  }
  componentDidMount() {
    if (this.state.addableOrders.length === 0) {
      this.props.dispatch(Actions.queryOrders({ purchaseOrder: null }, (addableOrders) => {
        this.setState({ addableOrders });
      }));
    }
  }
  addOrder(orderId) {
    this.props.dispatch(Actions.addOrderToPurchaseOrder(this.props.purchaseOrder._id, orderId));
  }
  render() {
    if (!this.props.purchaseOrder) { return <div></div>; }

    return (<div>
      <h1>Purchase Order</h1>
      <PurchaseOrderView purchaseOrder={this.props.purchaseOrder} addableOrders={this.state.addableOrders} addOrder={this.addOrder} />
    </div>);
  }
}

PurchaseOrderShowContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.object.isRequired,
};

export default connect()(PurchaseOrderShowContainer);
