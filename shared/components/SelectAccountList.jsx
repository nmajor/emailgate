import React, { PropTypes, Component } from 'react';
import SelectAccountListItem from './SelectAccountListItem';
import { Link } from 'react-router';


class SelectAccountList extends Component {
  renderAccountsList() {
    if (!this.props.accounts.length || this.props.accounts.length < 1) {
      return <div>No connected accounts</div>;
    }

    console.log('blah hey');
    console.log(this.props.currentAccountId);

    return this.props.accounts.map((account) => {
      return (<SelectAccountListItem
        key={account._id}
        account={account}
        selected={this.props.currentAccountId === account._id}
        selectAccount={this.props.selectAccount}
        deselectAccount={this.props.deselectAccount}
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

SelectAccountList.propTypes = {
  accounts: PropTypes.array.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
  currentAccountId: PropTypes.string,
  selectable: PropTypes.bool,
  selectAccount: PropTypes.func,
  deselectAccount: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

export default SelectAccountList;
