import React, { PropTypes, Component } from 'react';

class SelectAddressListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }
  handleCheckboxClick() {
    if (this.props.selected) {
      this.props.deselect(this.props.address);
    } else {
      this.props.select(this.props.address);
    }
  }
  renderPhone() {
    if (this.props.address.phone) {
      return <span> ({this.props.address.phone})</span>;
    }
  }
  renderCheckbox() {
    return (<span className={`right-bumper my-checkbox ${this.props.selected ? 'checked' : ''}`} onClick={this.handleCheckboxClick}>
      {this.props.selected ? <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> : null}
    </span>);
  }
  render() {
    return (
      <div>
        {this.renderCheckbox()}
        <span>{this.props.address.firstName} {this.props.address.lastName}</span>
        <span> - {this.props.address.address1} {this.props.address.address2}</span>
        <span>{this.props.address.city}, {this.props.address.region} {this.props.address.postalCode}</span>
        {this.renderPhone()}
      </div>
    );
  }
}

SelectAddressListItem.propTypes = {
  address: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
};

export default SelectAddressListItem;
