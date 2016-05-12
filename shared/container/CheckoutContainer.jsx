import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import ShippingAddressContainer from './ShippingAddressContainer';
import BillingAddressContainer from './BillingAddressContainer';
import BillingInfoFormContainer from './BillingInfoFormContainer';

class CheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderShippingAddress() {
    return <ShippingAddressContainer />;
  }
  renderBillingAddress() {
    if (this.props.checkout.shippingAddressId) {
      return <BillingAddressContainer />;
    }
  }
  renderBillingInfo() {
    if (this.props.checkout.shippingAddressId && this.props.checkout.billingAddressId) {
      return <BillingInfoFormContainer />;
    }
  }
  render() {
    return (<div>
      <Header />
      <div className="container">
        <h1>Checkout</h1>
        {this.renderShippingAddress()}
        {this.renderBillingAddress()}
        {this.renderBillingInfo()}
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
  };
}

CheckoutContainer.propTypes = {
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutContainer);
