import React, { PropTypes, Component } from 'react';

class AddressListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleItemClick = this.handleItemClick.bind(this);
  }
  handleItemClick() {
    this.props.handleItemClick(this.props.address);
  }
  renderSelectedClass() {
    if (this.props.selected) {
      return 'selected';
    }
  }
  render() {
    return (<div className={`address-list-item selectable ${this.renderSelectedClass()}`} onClick={this.handleItemClick}>
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
  handleItemClick: PropTypes.func.isRequired,
};

export default AddressListItem;
