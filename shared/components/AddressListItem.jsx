import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class AddressListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleItemClick() {
    if (this.props.handleItemClick) {
      this.props.handleItemClick(this.props.address);
    }
  }
  handleDeleteClick() {
    if (this.props.deleteItem) {
      this.props.deleteItem(this.props.address);
    }
  }
  renderSelectedClass() {
    if (this.props.selected) {
      return 'selected';
    }
  }
  renderRemoveLink() {
    if (this.props.deleteItem) {
      return (<span className="btn btn-default btn-xs" onClick={this.handleDeleteClick}>
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
  renderActions() {
    if (this.props.actions) {
      return (<div>
        {this.renderEditLink()}
        {this.renderRemoveLink()}
      </div>);
    }
  }
  render() {
    return (<div className={`address-list-item ${this.props.handleItemClick ? 'selectable' : ''} ${this.renderSelectedClass()}`} onClick={this.handleItemClick}>
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
      {this.renderActions()}
    </div>);
  }
}

AddressListItem.propTypes = {
  address: PropTypes.object.isRequired,
  actions: PropTypes.bool,
  selected: PropTypes.bool,
  handleItemClick: PropTypes.func,
  deleteItem: PropTypes.func,
};

export default AddressListItem;
