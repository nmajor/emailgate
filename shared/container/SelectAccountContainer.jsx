import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }
  }

  handleItemClick(accountId) {
    this.props.dispatch(Actions.setSelectedAccount(accountId));
  }

  render() {
    return (
      <div className="accounts-list-container">
        <h3>Select Account</h3>
        <AccountsList
          accounts={this.props.accounts}
          selectable
          selectedAccount={this.props.selectedAccount}
          onItemClick={this.handleItemClick}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    selectedAccount: store.selectedAccount,
  };
}

SelectAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedAccount: PropTypes.string,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(SelectAccountContainer);
