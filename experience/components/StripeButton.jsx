import React, { PropTypes, Component } from 'react';

class CheckoutPostcardContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.handleToken = this.handleToken.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  componentDidMount() {
    try {
      if (StripeCheckout) { // eslint-disable-line no-undef
        this.handler = StripeCheckout.configure({ // eslint-disable-line no-undef
          key: this.props.stripePublishableKey,
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          locale: 'auto',
          token: this.handleToken,
        });
      }
    } catch (err) {} // eslint-disable-line no-empty
  }
  handleToken(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
    this.props.onToken(token);
    this.handler.close();
  }
  handleButtonClick() {
    this.handler.open({
      name: 'Stripe.com',
      description: '2 widgets',
      zipCode: true,
      amount: 2000,
    });
  }
  render() {
    return (<button onClick={this.handleButtonClick}>Purchase</button>);
  }
}

CheckoutPostcardContainer.propTypes = {
  stripePublishableKey: PropTypes.string.isRequired,
  onToken: PropTypes.func.isRequired,
};

export default CheckoutPostcardContainer;
