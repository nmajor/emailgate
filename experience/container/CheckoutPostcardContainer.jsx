import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import StripeButton from '../components/StripeButton';
// import * as Actions from '../redux/actions/index';
import SendForm from '../components/SendForm';
import { getValues } from 'redux-form';

class CheckoutPostcardContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.onToken = this.onToken.bind(this);
  }
  onToken(token) {
    console.log('blah hey token', token);
    this.handler.close();
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
  }
  render() {
    return (<div>
      <SendForm initialValues={{}} />
      <StripeButton
        stripePublishableKey={this.props.config.stripePublishableKey}
        onToken={this.onToken}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config || {},
    sendFormValues: getValues(store.form.send),
  };
}

CheckoutPostcardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  sendFormValues: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutPostcardContainer);
