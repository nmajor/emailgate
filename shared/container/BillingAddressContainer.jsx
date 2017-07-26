import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class BillingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectAddress = this.selectAddress.bind(this);
    this.deselectAddress = this.deselectAddress.bind(this);
    this.createAddress = this.createAddress.bind(this);
    this.handleSameClick = this.handleSameClick.bind(this);
  }
  selectAddress(address) {
    this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', address._id));
  }
  deselectAddress() {
    this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', undefined));
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
          this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', res._id));
          resolve();
        }
      }));
    });
  }
  sameAsShipping() {
    const { billingAddressId, shippingAddressId } = this.props.checkout;
    return billingAddressId && billingAddressId === shippingAddressId;
  }
  handleSameClick() {
    const { shippingAddressId } = this.props.checkout;

    if (this.sameAsShipping()) {
      this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', undefined));
    } else {
      this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', shippingAddressId));
    }
  }
  renderHeader() {
    return (<div className="header">Step 2 - Billing Address</div>);
  }
  renderSameCheckbox() {
    return (<span className={`right-bumper my-checkbox ${this.sameAsShipping() ? 'checked' : ''}`} onClick={this.handleSameClick}>
      {this.sameAsShipping() ? <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> : null}
    </span>);
  }
  renderSameOption() {
    return (<div>
      {this.renderSameCheckbox()} <span style={{ fontSize: '16px' }}>Same as Shipping Address</span>
    </div>);
  }
  renderBody() {
    if (!this.props.show) {
      return <div className="body disabled">Please complete the previous steps.</div>;
    }

    if (this.sameAsShipping()) {
      return <div className="body">{this.renderSameOption()}</div>;
    }

    return (<div className="body">
      {this.renderSameOption()}
      <hr style={{ marginBottom: '35px' }} />
      <SelectAddressContainer
        selectAddress={this.selectAddress}
        deselectAddress={this.deselectAddress}
        selectedAddressId={this.props.checkout.billingAddressId}
        createAddress={this.createAddress}
      />
    </div>);
  }
  render() {
    return (<div className="checkout-address top-bumper">
      {this.renderHeader()}
      {this.renderBody()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
  };
}

BillingAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
  show: PropTypes.bool,
};

export default connect(mapStateToProps)(BillingAddressContainer);
