import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../components/Header';
import ShippingAddressContainer from './ShippingAddressContainer';
import BillingAddressContainer from './BillingAddressContainer';
import BillingInfoFormContainer from './BillingInfoFormContainer';

class CheckoutContainer extends Component {
  addressExists(addressId) {
    if (!addressId) { return false; }
    return _.some(this.props.addresses, (address) => { return address._id === addressId; });
  }
  renderShippingAddress() {
    return <ShippingAddressContainer />;
  }
  renderBillingAddress() {
    if (this.addressExists(this.props.checkout.shippingAddressId)) {
      return <BillingAddressContainer />;
    }
  }
  renderBillingInfo() {
    if (this.addressExists(this.props.checkout.shippingAddressId) && this.addressExists(this.props.checkout.billingAddressId)) {
      return <BillingInfoFormContainer />;
    }
  }
  render() {
    return (<div>
      <Header hideCart />
      <div className="container">
        <h1>Checkout</h1>
        <div className="row">
          <div className="col-md-6">
            {this.renderShippingAddress()}
          </div>
          <div className="col-md-6">
            {this.renderBillingAddress()}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.renderBillingInfo()}
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
    addresses: store.addresses,
  };
}

CheckoutContainer.propTypes = {
  checkout: PropTypes.object.isRequired,
  addresses: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(CheckoutContainer);
