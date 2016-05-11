import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectableAddressList from '../components/SelectableAddressList';
import * as Actions from '../redux/actions/index';
import Loading from '../components/Loading';

class SelectAddressContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.deleteAddress = this.deleteAddress.bind(this);
  }
  componentDidMount() {
    if (this.props.addresses.length < 1 && !this.props.fetching.addresses) {
      this.props.dispatch(Actions.getAddresses());
    }
  }
  deleteAddress() {
    console.log('deleteAddress');
  }
  renderAddressList() {
    if (this.props.fetching.addresses) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return (<SelectableAddressList
      addresses={this.props.addresses}
      selectItem={this.props.selectAddress}
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

SelectAddressContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  selectAddress: PropTypes.func.isRequired,
  selectedAddressId: PropTypes.string,
};

export default connect(mapStateToProps)(SelectAddressContainer);
