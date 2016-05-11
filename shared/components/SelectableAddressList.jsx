import React, { PropTypes, Component } from 'react';
import AddressListItem from './AddressListItem';
import { Link } from 'react-router';


class SelectableAddressList extends Component {
  renderAddressList() {
    if (this.props.addresses.length < 1) {
      return <div>No addresses</div>;
    }

    return this.props.addresses.map((address) => {
      return (<AddressListItem
        key={address._id}
        address={address}
        selected={this.props.selectedAddressId === address._id}
        handleItemClick={this.props.selectItem}
        deleteItem={this.props.deleteItem}
      />);
    });
  }
  renderNewAddress() {
    return (
      <Link to="/addresses/new" className="btn btn-default" >
        New Address
      </Link>
    );
  }
  render() {
    return (
      <div className="address-list row">
        <div className="col-md-6">
          {this.renderAddressList()}
          {this.renderNewAddress()}
        </div>
      </div>
    );
  }
}

SelectableAddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  selectedAddressId: PropTypes.string,
  selectItem: PropTypes.func,
  deleteItem: PropTypes.func,
};

export default SelectableAddressList;
