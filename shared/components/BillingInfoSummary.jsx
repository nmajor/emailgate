import React, { Component, PropTypes } from 'react';

class BillingInfoSummary extends Component { // eslint-disable-line
  render() {
    return (<div className="row">
      <div className="col-md-12">
        <div className="checkout-summary">
          <h4>{this.props.billingInfo.card.name}</h4>
          <div>{this.props.billingInfo.card.address_line1} {this.props.billingInfo.card.address_line2}</div>
          <div>{this.props.billingInfo.card.address_city}, {this.props.billingInfo.card.address_state} {this.props.billingInfo.card.address_zip}</div>
          <div className="top-bumper">{this.props.billingInfo.card.brand} Card ending in: {this.props.billingInfo.card.last4}</div>
          <div>Expires {this.props.billingInfo.card.exp_month}/{this.props.billingInfo.card.exp_year}</div>
        </div>
      </div>
    </div>);
  }
}

BillingInfoSummary.propTypes = {
  billingInfo: PropTypes.object.isRequired,
};

export default BillingInfoSummary;
