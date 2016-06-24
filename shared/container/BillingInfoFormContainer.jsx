import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import BillingInfoForm from '../components/BillingInfoForm';
import _ from 'lodash';
import * as Actions from '../redux/actions/index';

class BillingInfoFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cardErrors: {},
    };

    this.billingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.billingAddressId; }) || {};
    this.submitBillingForm = this.submitBillingForm.bind(this);
    this.getStripeToken = this.getStripeToken.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.billingAddress = _.find(nextProps.addresses, (address) => { return address._id === nextProps.checkout.billingAddressId; }) || {};
  }
  getStripeToken(paymentDetails) {
    return new Promise((resolve, reject) => {
      const Stripe = window.Stripe;

      Stripe.card.createToken(paymentDetails, (status, response) => {
        if (response.error) {
          const cardErrors = {};
          cardErrors[response.error.param] = response.error.message;
          this.setState({ cardErrors });
          reject();
        } else {
          this.props.dispatch(Actions.setPropertyForCheckout('stripeToken', response));
          resolve();
          this.redirectToNext();
        }
      });
    });
  }
  redirectToNext() {
    this.context.router.push(`/checkout/confirm`);
  }
  submitBillingForm(props) {
    const billingName = `${this.billingAddress.firstName} ${this.billingAddress.lastName}`;

    const paymentDetails = {
      number: props.number,
      exp_month: props.exp_month,
      exp_year: props.exp_year,
      cvc: props.cvc,
      name: billingName,
      address_line1: this.billingAddress.address1,
      address_line2: this.billingAddress.address2,
      address_city: this.billingAddress.city,
      address_state: this.billingAddress.region,
      address_zip: this.billingAddress.postalCode,
    };

    this.setState({ cardErrors: {} });
    return this.getStripeToken(paymentDetails);
  }

  render() {
    return (<div>
      <h3>Billing Info</h3>
      <BillingInfoForm
        billingAddress={this.billingAddress}
        onSubmit={this.submitBillingForm}
        cardErrors={this.state.cardErrors}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    checkout: store.checkout,
    fetching: store.fetching,
  };
}

BillingInfoFormContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

BillingInfoFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BillingInfoFormContainer);
