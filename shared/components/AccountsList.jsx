import React, { PropTypes, Component } from 'react';
import AccountListItem from './AccountListItem';


class AccountsList extends Component {
  handleNewAccountClick() {
    this.setState({ showNew: true });
  }

  renderAccountsList() {
    if (this.props.userAccounts.length < 1) {
      return 'No connected accounts';
    }

    return this.props.userAccounts.map((account) => {
      return <AccountListItem account={account} />;
    });
  }
  renderNewAccount() {
    return (
      <div
        className="btn btn-default add-account"
        onClick={this.handleNewAccountClick}
      >
        New Account
      </div>
    );
  }
  renderAccountForm() {

  }
  render() {
    return (
      <div className="accounts-list">
        {this.renderAccountsList()}
        {this.renderNewAccount()}
      </div>
    );
  }
}

AccountsList.propTypes = {
  userAccounts: PropTypes.array.isRequired,
};

export default AccountsList;
