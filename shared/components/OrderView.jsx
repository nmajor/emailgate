import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import AddressListItem from './AddressListItem';
import BillingInfoSummary from './BillingInfoSummary';
import CartView from './CartView';
// import _ from 'lodash';

class OrderView extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderShippingAddress() {
    if (this.props.order.shippingAddress) {
      return (<div>
        <h3>Shipped To</h3>
        <div className="selected-address">
          <AddressListItem address={this.props.order.shippingAddress} />
        </div>
      </div>);
    }
  }
  renderBillingInfoSummary() {
    return (<div>
      <h3>Billed To</h3>
      <BillingInfoSummary billingInfo={this.props.order.data.stripeToken} />
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
    return (<div>
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
