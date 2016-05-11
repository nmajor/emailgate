import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';

class ShippingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectAddress = this.selectAddress.bind(this);
  }
  selectAddress(address) {
    this.props.dispatch(Actions.setPropertyForCheckout('shippingAddressId', address._id));
  }
  render() {
    return (<div>
      <h3>Select Shipping Address</h3>
      <SelectAddressContainer selectAddress={this.selectAddress} selectedAddressId={this.props.checkout.shippingAddressId} />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
  };
}

ShippingAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ShippingAddressContainer);
