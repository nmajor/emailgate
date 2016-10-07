import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import PurchaseOrdersList from '../../components/purchaseOrders/PurchaseOrdersList';
import * as Actions from '../../redux/actions/index';

class PurchaseOrdersIndexContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }
  create() {
    this.props.dispatch(Actions.createPurchaseOrder({}));
  }
  delete(purchaseOrder) {
    this.props.dispatch(Actions.deletePurchaseOrder(purchaseOrder._id));
  }
  renderCreateNewAction() {
    return <button className="btn btn-success" onClick={this.create}>New</button>;
  }
  render() {
    return (<div>
      <h1>Purchase Orders</h1>
      <PurchaseOrdersList purchaseOrders={this.props.purchaseOrders} deletePurchaseOrder={this.delete} />
      <div>
        {this.renderCreateNewAction()}
      </div>
    </div>);
  }
}

PurchaseOrdersIndexContainer.propTypes = {
  dispatch: PropTypes.func,
  purchaseOrders: PropTypes.array,
};

export default connect()(PurchaseOrdersIndexContainer);
