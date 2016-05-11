import React, { Component } from 'react';
import { connect } from 'react-redux';

class BillingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<div>
      <h1>Billing Address Container</h1>
    </div>);
  }
}

export default connect()(BillingAddressContainer);
