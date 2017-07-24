import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectAddressList from '../components/SelectAddressList';
import AddressForm from '../components/AddressForm';
import SelectAddressListItem from '../components/SelectAddressListItem';
import * as Actions from '../redux/actions/index';
import Loading from '../components/Loading';
import _ from 'lodash';

class SelectAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showList: true,
    };

    this.deleteAddress = this.deleteAddress.bind(this);
    this.selectedAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.selectedAddressId; });
    this.renderNewAddressForm = this.renderNewAddressForm.bind(this);
  }
  componentDidMount() {
    if (this.props.addresses.length < 1 && !this.props.fetching.addresses) {
      this.props.dispatch(Actions.getAddresses());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.selectedAddress = _.find(nextProps.addresses, (address) => { return address._id === nextProps.selectedAddressId; });
  }
  deleteAddress(address) {
    this.props.dispatch(Actions.removeAddress(address._id));
  }
  renderNewAddressForm() {
    return <AddressForm onSubmit={this.props.createAddress} submitting={false} states={this.props.config.staticData.states} />;
  }
  renderAddressList() {
    if (this.props.fetching.addresses) {
      return <span className="alone-loading"><Loading /></span>;
    }

    if (this.selectedAddress && !this.props.selecting) {
      return (<div className="selected-address">
        <SelectAddressListItem
          address={this.selectedAddress}
          select={this.props.selectAddress}
          deselect={this.props.deselectAddress}
          selected
        />
      </div>);
    }

    return (<SelectAddressList
      addresses={this.props.addresses}
      select={this.props.selectAddress}
      deselect={this.props.deselectAddress}
      selectedAddressId={this.props.selectedAddressId}
      renderNewAddress={this.renderNewAddressForm}
    />);
  }
  render() {
    return (<div>
      {this.renderAddressList()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    addresses: store.addresses,
    config: store.config,
    fetching: store.fetching,
  };
}

SelectAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  addresses: PropTypes.array.isRequired,
  createAddress: PropTypes.func,
  fetching: PropTypes.object.isRequired,
  selecting: PropTypes.bool,
  selectAddress: PropTypes.func.isRequired,
  deselectAddress: PropTypes.func.isRequired,
  selectedAddressId: PropTypes.string,
};

export default connect(mapStateToProps)(SelectAddressContainer);
