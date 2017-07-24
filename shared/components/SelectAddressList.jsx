import React, { PropTypes, Component } from 'react';
import SelectAddressListItem from './SelectAddressListItem';

class SelectAddressList extends Component {
  renderSelectAddressList() {
    return this.props.addresses.map((address) => {
      return (<SelectAddressListItem
        key={address._id}
        address={address}
        selected={this.props.selectedAddressId === address._id}
        select={this.props.select}
        deselect={this.props.deselect}
      />);
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
