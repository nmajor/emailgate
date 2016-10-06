import React, { PropTypes, Component } from 'react';
import JSONTree from 'react-json-tree';

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
  renderRequestTree() {
    if (this.props.purchaseOrder.request) {
      const theme = {
        scheme: 'embers',
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#16130F',
  base01: '#2C2620',
  base02: '#433B32',
  base03: '#5A5047',
  base04: '#8A8075',
  base05: '#A39A90',
  base06: '#BEB6AE',
  base07: '#DBD6D1',
  base08: '#826D57',
  base09: '#828257',
  base0A: '#6D8257',
  base0B: '#57826D',
  base0C: '#576D82',
  base0D: '#6D5782',
  base0E: '#82576D',
  base0F: '#825757'
      };

      return (<JSONTree
        theme={theme}
        data={this.props.purchaseOrder.request}
        shouldExpandNode={() => { return true; }}
      />);
    }
  }
  render() {
    return (<div>
      <div className="row">
        <div className="col-md-6">
          <div>
            {JSON.stringify(this.props.purchaseOrder)}
          </div>
          <div>
            {this.renderAddOrderOptions()}
          </div>
        </div>
        <div className="col-md-6">
          {this.renderRequestTree()}
        </div>
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
