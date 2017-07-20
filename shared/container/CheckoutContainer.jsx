import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../redux/actions/index';
import Header from '../components/Header';
import ShippingAddressContainer from './ShippingAddressContainer';
import BillingAddressContainer from './BillingAddressContainer';
import BillingInfoFormContainer from './BillingInfoFormContainer';
import CartSummaryContainer from './CartSummaryContainer';

class CheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);

    console.log('blah params', props.params);

    this.state = {
      currentStep: 'shipping',
    };
  }
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
          <div className="col-md-8">
            {this.renderShippingAddress()}
            {this.renderBillingAddress()}
            {this.renderBillingInfo()}
          </div>
          <div className="col-md-4">
            <CartSummaryContainer compilations={this.props.compilations} />
          </div>
        </div>
      </div>
    </div>);
  }
}

CheckoutContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
    addresses: store.addresses,
    compilations: store.compilations,
  };
}

CheckoutContainer.propTypes = {
  checkout: PropTypes.object.isRequired,
  addresses: PropTypes.array.isRequired,
  compilations: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CheckoutContainer);
