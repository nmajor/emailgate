import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../components/Header';
import AddressListItem from '../components/AddressListItem';
import CartFormContainer from './CartFormContainer';
import BillingInfoSummary from '../components/BillingInfoSummary';
import OrderForm from '../components/OrderForm';
import * as Actions from '../redux/actions/index';

class CheckoutConfirmContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      submitting: false,
    };

    this.shippingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.shippingAddressId; });
    // this.billingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.billingAddressId; });
    this.submitOrder = this.submitOrder.bind(this);
  }
  submitOrder(props) {
    const orderProps = {
      cartId: this.props.cart._id,
      shippingAddress: this.shippingAddress,
      // billingAddress: this.billingAddress,
      data: {
        terms: props.terms,
        stripeToken: this.props.checkout.stripeToken,
      },
    };

    this.setState({ submitting: true });
    this.props.dispatch(Actions.createOrder(orderProps, (order) => {
      this.setState({ submitting: false });
      this.redirectToView(order);
    }));
  }
  redirectToView(order) {
    this.context.router.push(`/orders/${order._id}`);
  }
  renderCartSummary() {
    return <CartFormContainer editable={false} />;
  }
  renderShippingAddress() {
    if (this.shippingAddress) {
      return (<div>
        <h3>Ship To:</h3>
        <div className="selected-address">
          <AddressListItem address={this.shippingAddress} />
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
    return <OrderForm submit={this.submitOrder} submitting={this.state.submitting} />;
  }
  render() {
    return (<div>
      <Header />
      <div className="container">
        <h1>Confirm Order</h1>
        <div className="row">
          <div className="col-md-6">
            {this.renderShippingAddress()}
          </div>
          <div className="col-md-6">
            {this.renderBillingInfoSummary()}
          </div>
        </div>
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
    cart: store.cart,
  };
}

CheckoutConfirmContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CheckoutConfirmContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  checkout: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutConfirmContainer);
