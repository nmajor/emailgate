import React, { Component } from 'react';

class AccountListItem extends Component {
  render() {
    return (
      <div className="accounts-list-item">
        {this.props.account.email}
      </div>
    );
  }
}

export default AccountListItem;
