import React, { PropTypes, Component } from 'react';

class AddOrderOption extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.addOrder = this.addOrder.bind(this);
  }
  addOrder() {
    this.props.addOrder(this.props.order._id);
  }
  render() {
    return (<div>
      <span>{this.props.order._id}</span>
      <button
        className="btn btn-xs-true btn-success"
        onClick={this.addOrder}
      >Add</button>
    </div>);
  }
}

AddOrderOption.propTypes = {
  order: PropTypes.object.isRequired,
  addOrder: PropTypes.func.isRequired,
};


class PurchaseOrderView extends Component { // eslint-disable-line
  renderAddOrderOptions() {
    return this.props.addableOrders.map((order) => {
      return <AddOrderOption key={order._id} order={order} addOrder={this.props.addOrder} />;
    });
  }
  render() {
    return (<div>
      <div>
        {JSON.stringify(this.props.purchaseOrder)}
      </div>
      <div>
        {this.renderAddOrderOptions()}
      </div>
    </div>);
  }
}

PurchaseOrderView.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
  addableOrders: PropTypes.array.isRequired,
  addOrder: PropTypes.func.isRequired,
};

export default PurchaseOrderView;
