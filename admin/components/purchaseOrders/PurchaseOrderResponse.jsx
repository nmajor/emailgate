import React, { PropTypes, Component } from 'react';

class PurchaseOrderResponse extends Component { // eslint-disable-line
  render() {
    return (<div>
      {JSON.stringify(this.props.purchaseOrder.responses)}
    </div>);
  }
}

PurchaseOrderResponse.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderResponse;
