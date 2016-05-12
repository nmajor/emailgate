import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../components/Header';
import AddressListItem from '../components/AddressListItem';
import CartFormContainer from './CartFormContainer';
import BillingInfoSummary from '../components/BillingInfoSummary';
import OrderForm from '../components/OrderForm';

class CheckoutConfirmContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.shippingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.shippingAddressId; });
    this.submitOrder = this.submitOrder.bind(this);
  }
  submitOrder(props) {
    console.log('blah blah');
    console.log(props);
  }
  renderCartSummary() {
    return <CartFormContainer editable={false} />;
  }
  renderShippingAddress() {
    if (this.shippingAddress) {
      return (<div>
        <h3>Ship To:</h3>
        <div className="row">
          <div className="col-md-12">
            <div className="selected-address">
              <AddressListItem address={this.shippingAddress} />
            </div>
          </div>
        </div>
      </div>);
    }
  }
  renderBillingInfoSummary() {
    return (<div>
      <h3>Bill To:</h3>
      <BillingInfoSummary billingInfo={this.props.checkout.stripeToken} />
    </div>);
  }
  renderOrderForm() {
    return <OrderForm submit={this.submitOrder} />;
  }
  render() {
    return (<div>
      <Header />
      <div className="container">
        <h1>Confirm Order</h1>
        {this.renderShippingAddress()}
        {this.renderBillingInfoSummary()}
        {this.renderCartSummary()}
        {this.renderOrderForm()}
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    checkout: store.checkout,
  };
}

CheckoutConfirmContainer.propTypes = {
  addresses: PropTypes.array.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutConfirmContainer);
