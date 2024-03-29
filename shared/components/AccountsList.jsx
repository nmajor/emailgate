import React, { PropTypes, Component } from 'react';
import AccountsListItem from './AccountsListItem';
import { Link } from 'react-router';


class AccountsList extends Component {
  renderAccountsList() {
    if (!this.props.accounts.length || this.props.accounts.length < 1) {
      return <div>No connected accounts</div>;
    }

    return this.props.accounts.map((account) => {
      return (<AccountsListItem
        key={account._id}
        account={account}
        handleClick={this.props.onItemClick}
        handleDeleteClick={this.props.onDeleteClick}
        googleAuthUrl={this.props.googleAuthUrl}
      />);
    });
  }
  renderNewAccount() {
    return (<Link to="/accounts/new" className="btn btn-default new-account" >
      New Account
    </Link>);
  }
  render() {
    return (<div className="accounts-list">
      {this.renderAccountsList()}
      {this.renderNewAccount()}
    </div>);
  }
}

AccountsList.propTypes = {
  accounts: PropTypes.array.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
  currentAccountId: PropTypes.string,
  selectable: PropTypes.bool,
  onItemClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

export default AccountsList;
