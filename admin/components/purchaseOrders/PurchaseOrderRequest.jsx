import React, { PropTypes, Component } from 'react';
import JsonViewer from '../JsonViewer';

class PurchaseOrderRequest extends Component { // eslint-disable-line
  renderTree() {
    if (this.props.purchaseOrder.request) {
      return (<JsonViewer
        obj={this.props.purchaseOrder.request}
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
