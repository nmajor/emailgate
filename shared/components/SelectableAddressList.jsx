import React, { PropTypes, Component } from 'react';
import AddressListItem from './AddressListItem';
import { Link } from 'react-router';


class SelectableAddressList extends Component {
  renderAddressList() {
    if (this.props.addresses.length > 0) {
      return this.props.addresses.map((address) => {
        return (<AddressListItem
          key={address._id}
          address={address}
          actions
          selected={this.props.selectedAddressId === address._id}
          handleItemClick={this.props.selectItem}
          deleteItem={this.props.deleteItem}
        />);
      });
    }
  }
  renderNewAddress() {
    if (this.props.addresses.length > 0) {
      return null;
    } else if (this.props.renderNewAddress) {
      return this.props.renderNewAddress();
    }

    return (
      <Link to="/addresses/new" className="btn btn-default" >
        Add a New Address
      </Link>
    );
  }
  render() {
    return (<div className="address-list">
      {this.renderAddressList()}
      {this.renderNewAddress()}
    </div>);
  }
}

SelectableAddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  selectedAddressId: PropTypes.string,
  selectItem: PropTypes.func,
  deleteItem: PropTypes.func,
  renderNewAddress: PropTypes.func,
};

export default SelectableAddressList;
