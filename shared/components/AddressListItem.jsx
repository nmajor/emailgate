import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

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
  renderRemoveLink() {
    if (this.props.deleteItem) {
      return (<span className="btn btn-default btn-xs left-bumper" onClick={this.handleDeleteClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
      </span>);
    }
  }
  renderEditLink() {
    return (<Link className="btn btn-default btn-xs" to={`/addresses/${this.props.address._id}/edit`}>
      <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
    </Link>);
  }
  renderPhone() {
    if (this.props.address.phone) {
      return <div>{this.props.address.phone}</div>;
    }
  }
  render() {
    return (<div className={`address-list-item selectable ${this.renderSelectedClass()}`} onClick={this.handleItemClick}>
      <h4>
        {this.props.address.firstName} {this.props.address.lastName}
      </h4>
      <div>
        {this.props.address.address1} {this.props.address.address2}
      </div>
      <div>
        {this.props.address.city}, {this.props.address.region} {this.props.address.postalCode}
      </div>
      {this.renderPhone()}
      <div>
        {this.renderEditLink()}
        {this.renderRemoveLink()}
      </div>
    </div>);
  }
}

AddressListItem.propTypes = {
  address: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  handleItemClick: PropTypes.func.isRequired,
  deleteItem: PropTypes.func,
};

export default AddressListItem;
