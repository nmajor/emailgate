import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import CartView from './CartView';
// import _ from 'lodash';

class OrderView extends Component {
  // constructor(props, context) {
  //   super(props, context);
  // }
  renderAddressSummary(address) {
    return (<div>
      <div>{address.firstName} {address.lastName}</div>
      <div>{address.address1} {address.address2}</div>
      <div>{address.city}, {address.region} {address.postalCode}</div>
    </div>);
  }
  renderShippingAddress() {
    return (<div className="bottom-bumper">
      <h4>Shipping Address:</h4>
      {this.renderAddressSummary(this.props.order.shippingAddress)}
    </div>);
  }
  renderBillingInfoSummary() {
    return (<div>
      <h4>Billing Address:</h4>
      {this.renderAddressSummary(this.props.order.billingAddress)}
      <div className="top-bumper">{this.props.order.data.stripeToken.card.brand} Card ending in: {this.props.order.data.stripeToken.card.last4}</div>
    </div>);
  }
  renderCartSummary() {
    return (<div>
      <h3>Order Summary</h3>
      <CartView
        cart={this.props.order}
        editable={false}
      />
    </div>);
  }
  render() {
    return (<div className="checkout-confirm">
      <h1>Order Details</h1>
      <Link className="btn btn-default" to="/dashboard">Back to Dashboard</Link>
      <div className="row">
        <div className="col-md-6">
          {this.renderShippingAddress()}
        </div>
        <div className="col-md-6">
          {this.renderBillingInfoSummary()}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {this.renderCartSummary()}
        </div>
      </div>
    </div>);
  }
}

OrderView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderView;
