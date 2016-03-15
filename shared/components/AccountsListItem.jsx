import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class AccountListItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.props.handleClick) {
      this.props.handleClick(this.props.account);
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
      <div className={this.renderClassName()} onClick={this.handleClick} >
        {this.renderEmail()}
        {this.renderConnectionStatus()}
        {this.renderSelected()}
        <Link to={`/accounts/${this.props.account._id}/edit`}>edit</Link>
      </div>
    );
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default AccountListItem;
