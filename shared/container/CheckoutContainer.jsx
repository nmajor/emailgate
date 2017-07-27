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

    this.state = {
      currentStep: 'shipping',
    };
  }
  componentWillMount() {
    if (_.isEmpty(this.props.cart)) {
      this.context.router.push('/dashboard');
    }
  }
  addressExists(addressId) {
    if (!addressId) { return false; }
    return _.some(this.props.addresses, (address) => { return address._id === addressId; });
  }
  render() {
    const { billingAddressId, shippingAddressId } = this.props.checkout;
    const showBillingAddress = !!(shippingAddressId);
    const showBillingForm = !!(billingAddressId && shippingAddressId);

    return (<div>
      <Header hideCart />
      <div className="container">
        <h1>Checkout</h1>
        <div className="row">
          <div className="col-md-8">
            <ShippingAddressContainer />
            <BillingAddressContainer show={showBillingAddress} />
            <BillingInfoFormContainer show={showBillingForm} />
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
    cart: store.cart,
  };
}

CheckoutContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CheckoutContainer.propTypes = {
  checkout: PropTypes.object.isRequired,
  addresses: PropTypes.array.isRequired,
  compilations: PropTypes.array.isRequired,
  params: PropTypes.object,
  cart: PropTypes.object,
};

export default connect(mapStateToProps)(CheckoutContainer);
