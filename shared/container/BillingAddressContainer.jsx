import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';

class BillingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectAddress = this.selectAddress.bind(this);
  }
  selectAddress(address) {
    this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', address._id));
  }
  render() {
    return (<div>
      <h3>Select Billing Address</h3>
      <SelectAddressContainer selectAddress={this.selectAddress} selectedAddressId={this.props.checkout.billingAddressId} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
  };
}

BillingAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BillingAddressContainer);
