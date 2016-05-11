import React, { Component } from 'react';
import { connect } from 'react-redux';

class BillingInfoContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<div>
      <h1>Billing Info Container</h1>
    </div>);
  }
}

export default connect()(BillingInfoContainer);
