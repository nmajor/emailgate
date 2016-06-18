import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectableAddressList from '../components/SelectableAddressList';
import * as Actions from '../redux/actions/index';
import Loading from '../components/Loading';
import _ from 'lodash';

class AddressListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showList: true,
    };

    this.deleteAddress = this.deleteAddress.bind(this);
    this.selectedAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.selectedAddressId; });
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
  renderAddressList() {
    if (this.props.fetching.addresses) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return (<SelectableAddressList
      addresses={this.props.addresses}
      deleteItem={this.deleteAddress}
      selectedAddressId={this.props.selectedAddressId}
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
    fetching: store.fetching,
  };
}

AddressListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  selectedAddressId: PropTypes.string,
};

export default connect(mapStateToProps)(AddressListContainer);
