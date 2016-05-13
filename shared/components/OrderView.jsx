import React, { PropTypes, Component } from 'react';
import AddressListItem from './AddressListItem';
import BillingInfoSummary from './BillingInfoSummary';
import CartFormContainer from '../container/CartFormContainer';

class OrderView extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderShippingAddress() {
    if (this.props.order.shippingAddress) {
      return (<div>
        <h3>Ship To:</h3>
        <div className="selected-address">
          <AddressListItem address={this.props.order.shippingAddress} />
        </div>
      </div>);
    }
  }
  renderBillingInfoSummary() {
    return (<div>
      <h3>Bill To:</h3>
      <BillingInfoSummary billingInfo={this.props.order.data.stripeToken} />
    </div>);
  }
  renderCartSummary() {
    return <CartFormContainer editable={false} />;
  }
  render() {
    return (<div>
      <h1>Order Details</h1>
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
