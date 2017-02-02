import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class BillingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selecting: !this.props.checkout.billingAddressId,
    };

    this.selectAddress = this.selectAddress.bind(this);
    this.setSelecting = this.setSelecting.bind(this);
    this.unsetSelecting = this.unsetSelecting.bind(this);
    this.createAddress = this.createAddress.bind(this);
  }
  setSelecting() {
    this.setState({ selecting: true });
  }
  unsetSelecting() {
    this.setState({ selecting: false });
  }
  selectAddress(address) {
    this.props.dispatch(Actions.setPropertyForCheckout('billingAddressId', address._id));
    this.setState({ selecting: false });
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
  renderSelectingAction() {
    if (this.state.selecting === false) {
      return <span className="btn btn-default btn-xs btn-h" onClick={this.setSelecting}>Change</span>;
    } else if (this.props.checkout.billingAddressId && this.state.selecting === true) {
      return <span className="btn btn-danger btn-xs btn-h" onClick={this.unsetSelecting}>Cancel</span>;
    }
  }
  render() {
    return (<div>
      <h3>Select Billing Address {this.renderSelectingAction()}</h3>
      <SelectAddressContainer
        selectAddress={this.selectAddress}
        selectedAddressId={this.props.checkout.billingAddressId}
        selecting={this.state.selecting}
        createAddress={this.createAddress}
      />
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
};

export default connect(mapStateToProps)(BillingAddressContainer);
