import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class ShippingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectAddress = this.selectAddress.bind(this);
    this.deselectAddress = this.deselectAddress.bind(this);
    this.createAddress = this.createAddress.bind(this);
  }
  selectAddress(address) {
    this.props.dispatch(Actions.setPropertyForCheckout('shippingAddressId', address._id));
  }
  deselectAddress() {
    this.props.dispatch(Actions.setPropertyForCheckout('shippingAddressId', undefined));
  }
  createAddress(props) {
    return new Promise((resolve, reject) => {
      this.props.dispatch(Actions.createAddress(props, (res) => {
        if (res.errors) {
          const errors = {
            _error: 'Could not create address',
          };

          _.forEach(res.errors, (val, key) => {
            errors[key] = val.message;
          });

          reject(errors);
        } else {
          this.props.dispatch(Actions.setPropertyForCheckout('shippingAddressId', res._id));
          resolve();
        }
      }));
    });
  }
  renderHeaderText() {
    if (this.props.addresses.length > 1) {
      return 'Select Shipping Address';
    }

    return 'Enter Shipping Address';
  }
  renderHeader() {
    return (<div className="header">Step 1 - {this.renderHeaderText()}</div>);
  }
  renderBody() {
    if (this.props.expanded) {
      return (<div className="body"></div>);
    }

    return (<div className="body">
      <SelectAddressContainer
        selectAddress={this.selectAddress}
        deselectAddress={this.deselectAddress}
        selectedAddressId={this.props.checkout.shippingAddressId}
        createAddress={this.createAddress}
      />
    </div>);
  }
  render() {
    return (<div className="checkout-address">
      {this.renderHeader()}
      {this.renderBody()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    checkout: store.checkout,
  };
}

ShippingAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
  addresses: PropTypes.array.isRequired,
  expanded: PropTypes.bool,
};

export default connect(mapStateToProps)(ShippingAddressContainer);
