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
    this.context.router.push('/checkout/confirm');
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
  renderHeader() {
    return (<div className="header">Step 3 - Payment Details</div>);
  }
  renderSslSeal() {
    return (<span style={{ display: 'inline-block' }}>
      <a href="https://ssl.comodo.com">
        <img src="https://ssl.comodo.com/images/trusted-site-seal.png" alt="Comodo Trusted Site Seal" width="113" height="59" style={{ border: '0px' }} />
      </a>
      <br />
    </span>);
  }
  renderStripeBadge() {
    return (<span style={{ position: 'relative', top: 8 }}><a href="https://stripe.com"><img role="presentation" src="/img/powered_by_stripe.png" /></a></span>);
  }
  renderPaymentIcons() {
    return (<div>
      <img className="right-bumper" role="presentation" height="30" src="/img/payment-icons/visa.png" />
      <img className="right-bumper" role="presentation" height="30" src="/img/payment-icons/mastercard.png" />
      <img className="right-bumper" role="presentation" height="30" src="/img/payment-icons/discover.png" />
      <img className="right-bumper" role="presentation" height="30" src="/img/payment-icons/american-express.png" />
    </div>);
  }
  renderBody() {
    if (!this.props.show) {
      return <div className="body disabled">Please complete the previous steps.</div>;
    }

    return (<div className="body">
      {this.renderPaymentIcons()}
      <div className="padded-box bottom-bumper top-bumper">
        <BillingInfoForm
          billingAddress={this.billingAddress}
          onSubmit={this.submitBillingForm}
          cardErrors={this.state.cardErrors}
          initialValues={{ exp_month: 1, exp_year: new Date().getFullYear() }}
        />
      </div>
      <div className="row" style={{ position: 'relative', height: '59px' }}>
        <div className="col-xs-12 text-left" style={{ height: 'inherit' }}>
          {this.renderSslSeal()}
          {this.renderStripeBadge()}
        </div>
      </div>
    </div>);
  }
  render() {
    return (<div className="checkout-address top-bumper">
      {this.renderHeader()}
      {this.renderBody()}
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
  show: PropTypes.bool,
};

export default connect(mapStateToProps)(BillingInfoFormContainer);
