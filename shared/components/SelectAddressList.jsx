import React, { PropTypes, Component } from 'react';
import SelectAddressListItem from './SelectAddressListItem';

class SelectAddressList extends Component {
  renderSelectAddressList() {
    return this.props.addresses.map((address) => {
      return (<div key={address._id} className="select-address-item">
        <SelectAddressListItem
          address={address}
          selected={this.props.selectedAddressId === address._id}
          select={this.props.select}
          deselect={this.props.deselect}
        />
      </div>);
    });
  }
  render() {
    return (<div>
      {this.renderSelectAddressList()}
    </div>);
  }
}

SelectAddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  selectedAddressId: PropTypes.string,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
};

export default SelectAddressList;
