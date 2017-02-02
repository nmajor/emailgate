import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class ShippingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selecting: !(this.props.checkout.shippingAddressId),
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
    this.props.dispatch(Actions.setPropertyForCheckout('shippingAddressId', address._id));
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
    } else if (this.props.checkout.shippingAddressId && this.state.selecting === true) {
      return <span className="btn btn-danger btn-xs btn-h" onClick={this.unsetSelecting}>Cancel</span>;
    }
  }
  renderHeaderText() {
    if (this.props.addresses.length > 1) {
      return 'Select Shipping Address';
    }

    return 'Enter Shipping Address';
  }
  render() {
    return (<div>
      <h3>{this.renderHeaderText()} {this.renderSelectingAction()}</h3>
      <SelectAddressContainer
        selectAddress={this.selectAddress}
        selectedAddressId={this.props.checkout.shippingAddressId}
        selecting={this.state.selecting}
        createAddress={this.createAddress}
      />
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
};

export default connect(mapStateToProps)(ShippingAddressContainer);
