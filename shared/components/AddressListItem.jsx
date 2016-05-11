import React, { PropTypes, Component } from 'react';

class AddressListItem extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (<div>
      {this.props.address.firstName}
      {this.props.address.lastName}
      {this.props.address.address1}
      {this.props.address.address2}
      {this.props.address.city}
      {this.props.address.region}
      {this.props.address.postalCode}
    </div>);
  }
}

AddressListItem.propTypes = {
  address: PropTypes.object.isRequired,
  selected: PropTypes.bool,
};

export default AddressListItem;
