import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';

class ShippingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<div>
      <h1>Shipping Address Container</h1>
      <SelectAddressContainer />
    </div>);
  }
}

export default connect()(ShippingAddressContainer);
