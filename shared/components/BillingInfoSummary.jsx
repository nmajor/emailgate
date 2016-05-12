import React, { Component, PropTypes } from 'react';
import Card from 'react-credit-card';

class BillingInfoSummary extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderCard() {
    const expiryDate = new Date(this.props.billingInfo.card.exp_year, (this.props.billingInfo.card.exp_month - 1));
    const expiryYear = expiryDate.getFullYear().toString().substr(2, 2);
    const expiryMonth = (`0${expiryDate.getMonth() + 1}`).slice(-2);

    return (<div className="top-bumper">
      <Card
        name={this.props.billingInfo.card.name}
        number={`############${this.props.billingInfo.card.last4}`}
        expiry={`${expiryMonth}${expiryYear}`}
      />
    </div>);
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="checkout-summary">
            <h4>{this.props.billingInfo.card.name}</h4>
            <div>{this.props.billingInfo.card.brand} Card ending in: {this.props.billingInfo.card.last4}</div>
            <div>Expires {this.props.billingInfo.card.exp_month}/{this.props.billingInfo.card.exp_year}</div>
            {this.renderCard()}
          </div>
        </div>
      </div>
    );
  }
}

BillingInfoSummary.propTypes = {
  billingInfo: PropTypes.object,
};

export default BillingInfoSummary;
