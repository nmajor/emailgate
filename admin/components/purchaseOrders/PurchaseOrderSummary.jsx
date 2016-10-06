import React, { PropTypes, Component } from 'react';

class PurchaseOrderSummary extends Component { // eslint-disable-line
  render() {
    return (<div>
      {JSON.stringify(this.props.purchaseOrder)}
    </div>);
  }
}

PurchaseOrderSummary.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderSummary;
