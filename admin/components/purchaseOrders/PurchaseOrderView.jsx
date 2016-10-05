import React, { PropTypes, Component } from 'react';

class PurchaseOrderView extends Component { // eslint-disable-line
  render() {
    return (<div>
      {JSON.stringify(this.props.purchaseOrder)}
    </div>);
  }
}

PurchaseOrderView.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderView;
