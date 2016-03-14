import React, { PropTypes, Component } from 'react';
import AccountsListItem from './AccountsListItem';
import { Link } from 'react-router';


class AccountsList extends Component {
  renderAccountsList() {
    if (!this.props.accounts.length || this.props.accounts.length < 1) {
      return 'No connected accounts';
    }

    return this.props.accounts.map((account) => {
      return <AccountsListItem key={account._id} account={account} />;
    });
  }
  renderNewAccount() {
    return (
      <Link to="/accounts/new" className="btn btn-default new-account" >
        New Account
      </Link>
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
  accounts: PropTypes.array.isRequired,
};

export default AccountsList;
