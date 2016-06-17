import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class AccountListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.account);
    }
  }
  handleDeleteClick() {
    if (this.props.handleDeleteClick) {
      this.props.handleDeleteClick(this.props.account);
    }
  }
  renderRemoveLink() { // eslint-disable-line consistent-return
    if (this.props.handleDeleteClick) {
      return (<span className="btn btn-default btn-xs left-bumper" onClick={this.handleDeleteClick}>
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
      </span>);
    }
  }
  renderEditLink() { // eslint-disable-line consistent-return
    if (this.props.account.kind === 'imap') {
      return (<Link className="btn btn-default btn-xs left-bumper" to={`/accounts/${this.props.account._id}/edit`}>
        <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
      </Link>);
    }
  }
  renderEmail() { // eslint-disable-line consistent-return
    return <span className="left-bumper">{this.props.account.email}</span>;
  }
  renderConnectionStatus() {
    if (this.props.account.connectionValid === false) {
      return (<span className="label label-danger">
        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </span>);
    } else if (this.props.account.connectionValid === true) {
      return (<span className="label label-success">
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </span>);
    }

    return (<span className="label label-default">
      <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
    </span>);
  }
  renderSelected() { // eslint-disable-line consistent-return
    if (this.props.selected) {
      return 'selected';
    }
  }
  renderClassName() {
    let className = 'accounts-list-item ';
    className += this.props.selectable ? 'selectable ' : '';
    className += this.props.selected ? 'selected ' : '';
    return className;
  }
  renderKind() {
    return <span className="label label-default">{this.props.account.kind}</span>;
  }
  render() {
    return (
      <div className={this.renderClassName()} onClick={this.handleClick}>
        <h4>
          {this.renderConnectionStatus()}
          {this.renderEmail()}
        </h4>
        <div>
          {this.renderKind()}
          {this.renderEditLink()}
          {this.renderRemoveLink()}
        </div>
      </div>
    );
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  handleDeleteClick: PropTypes.func,
};

export default AccountListItem;
