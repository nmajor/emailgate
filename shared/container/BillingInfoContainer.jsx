import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import BillingInfoForm from '../components/BillingInfoForm';
import _ from 'lodash';

class BillingInfoContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.billingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.billingAddressId; }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.billingAddress = _.find(nextProps.addresses, (address) => { return address._id === nextProps.checkout.billingAddressId; }) || {};
  }

  render() {
    return (<div>
      <h1>Billing Info Container</h1>
      <BillingInfoForm billingAddress={this.billingAddress} />
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

BillingInfoContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BillingInfoContainer);
