import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as Actions from '../redux/actions/index';
import Header from '../components/Header';
import ShippingAddressContainer from './ShippingAddressContainer';
import BillingAddressContainer from './BillingAddressContainer';
import BillingInfoFormContainer from './BillingInfoFormContainer';
import CartSummaryContainer from './CartSummaryContainer';
import { buffCart } from '../helpers';

class CheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      currentStep: 'shipping',
    };

    this.redirectToNext = this.redirectToNext.bind(this);
  }
  componentWillMount() {
    if (_.isEmpty(this.props.cart)) {
      this.context.router.push('/dashboard');
    }
  }
  redirectToNext() {
    this.context.router.push('/checkout/confirm');
  }
  // submitZeroOrder() {
  //   const billingName = `${this.billingAddress.firstName} ${this.billingAddress.lastName}`;
  //
  //   const paymentDetails = {
  //     // number: props.number,
  //     // exp_month: props.exp_month,
  //     // exp_year: props.exp_year,
  //     // cvc: props.cvc,
  //     // name: billingName,
  //     // address_line1: this.billingAddress.address1,
  //     // address_line2: this.billingAddress.address2,
  //     // address_city: this.billingAddress.city,
  //     // address_state: this.billingAddress.region,
  //     // address_zip: this.billingAddress.postalCode,
  //   };
  //
  //   return new Promise((resolve, reject) => {
  //     const Stripe = window.Stripe;
  //
  //     Stripe.card.createToken(paymentDetails, (status, response) => {
  //       if (response.error) {
  //         const cardErrors = {};
  //         cardErrors[response.error.param] = response.error.message;
  //         this.setState({ cardErrors });
  //         reject();
  //       } else {
  //         this.props.dispatch(Actions.setPropertyForCheckout('stripeToken', response));
  //         resolve();
  //         this.redirectToNext();
  //       }
  //     });
  //   });
  // }
  addressExists(addressId) {
    if (!addressId) { return false; }
    return _.some(this.props.addresses, (address) => { return address._id === addressId; });
  }
  renderBillingSteps() {
    const { billingAddressId, shippingAddressId } = this.props.checkout;
    const showBillingAddress = !!(shippingAddressId);
    const showBillingForm = !!(billingAddressId && shippingAddressId);

    const cart = buffCart(this.props.cart, this.props.compilations, this.props.config.products);
    if (cart.total === 0) {
      let proceed = (<div className="btn btn-success right-most" onClick={this.redirectToNext}>Proceed to order Confirmation</div>);

      if (!shippingAddressId) {
        return null;
      }

      return (<div className="top-bumper text-right">
        {proceed}
      </div>);
    }

    return (<div>
      <BillingAddressContainer show={showBillingAddress} />
      <BillingInfoFormContainer show={showBillingForm} />
    </div>);
  }
  render() {
    return (<div>
      <Header hideCart />
      <div className="container">
        <h1>Checkout</h1>
        <div className="row">
          <div className="col-md-8">
            <ShippingAddressContainer />
            {this.renderBillingSteps()}
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
    return Actions.getCompilations.bind(null, null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
    addresses: store.addresses,
    compilations: store.compilations,
    cart: store.cart,
    config: store.config,
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
  cart: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutContainer);
