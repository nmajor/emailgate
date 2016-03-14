import React, { PropTypes, Component } from 'react';
import AccountsListItem from './AccountsListItem';
import { Link } from 'react-router';


class AccountsList extends Component {
  renderAccountsList() {
    if (!this.props.accounts.length || this.props.accounts.length < 1) {
      return 'No connected accounts';
    }

    console.log('blahyoda');
    console.log(this.props.selectedAccount);

    return this.props.accounts.map((account) => {
      return (<AccountsListItem
        key={account._id}
        account={account}
        selectable={this.props.selectable}
        selected={this.props.selectable && this.props.selectedAccount === account._id}
        handleClick={this.props.onItemClick}
      />);
    });
  }
  renderNewAccount() {
    return (
      <Link to="/accounts/new" className="btn btn-default new-account" >
        New Account
      </Link>
    );
  }
  render() {
    console.log('renderblah');
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
  selectedAccount: PropTypes.string,
  selectable: PropTypes.bool,
  onItemClick: PropTypes.func.isRequired,
};

export default AccountsList;
