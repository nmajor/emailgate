import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressContainer from './SelectAddressContainer';
import * as Actions from '../redux/actions/index';

class ShippingAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selecting: this.props.checkout.shippingAddressId ? false : true,
    };

    this.selectAddress = this.selectAddress.bind(this);
    this.setSelecting = this.setSelecting.bind(this);
    this.unsetSelecting = this.unsetSelecting.bind(this);
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
  renderSelectingAction() {
    if (this.state.selecting === false) {
      return <span className="btn btn-default btn-xs" onClick={this.setSelecting}>Change</span>;
    } else if (this.props.checkout.shippingAddressId && this.state.selecting === true) {
      return <span className="btn btn-danger btn-xs" onClick={this.unsetSelecting}>Cancel</span>;
    }
  }
  render() {
    return (<div>
      <h3>Select Shipping Address {this.renderSelectingAction()}</h3>
      <SelectAddressContainer
        selectAddress={this.selectAddress}
        selectedAddressId={this.props.checkout.shippingAddressId}
        selecting={this.state.selecting}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    checkout: store.checkout,
  };
}

ShippingAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ShippingAddressContainer);
