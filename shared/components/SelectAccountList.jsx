import React, { PropTypes, Component } from 'react';
import SelectAccountListItem from './SelectAccountListItem';
// import { Link } from 'react-router';


class SelectAccountList extends Component {
  renderAccountsList() {
    if (!this.props.accounts.length || this.props.accounts.length < 1) {
      return <div>No connected accounts</div>;
    }

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
  render() {
    return (<div className="accounts-list">
      {this.renderAccountsList()}
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
