import React, { PropTypes, Component } from 'react';
import JSONTree from 'react-json-tree';

class PurchaseOrderRequest extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.theme = {
      scheme: 'embers',
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
      base0F: '#825757',
    };
  }
  renderTree() {
    if (this.props.purchaseOrder.request) {
      return (<JSONTree
        theme={this.theme}
        data={this.props.purchaseOrder.request}
      />);
    }

    return 'No request yet...';
  }
  render() {
    return <div>{this.renderTree()}</div>;
  }
}

PurchaseOrderRequest.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderRequest;
