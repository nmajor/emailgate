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
  renderRemoveLink() {
    if (this.props.handleDeleteClick) {
      return <span onClick={this.handleDeleteClick}>remove</span>;
    }
  }
  renderEditLink() {
    if (this.props.account.kind === 'imap') {
      return <Link to={`/accounts/${this.props.account._id}/edit`}>edit</Link>;
    }
  }
  renderEmail() {
    return this.props.account.email;
  }
  renderConnectionStatus() {
    return this.props.account.connectionValid ? 'good' : 'bad';
  }
  renderSelected() {
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
  render() {
    return (
      <div className={this.renderClassName()}>
        <span onClick={this.handleClick}>
          {this.props.account.kind}
          {this.renderEmail()}
          {this.renderConnectionStatus()}
          {this.renderSelected()}
        </span>
        {this.renderEditLink()}
        {this.renderRemoveLink()}
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
