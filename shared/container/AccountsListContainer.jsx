import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';

class AccountsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }
  }

  render() {
    return (
      <div className="accounts-list-container">
        <h3>Connected Email Accounts</h3>
        <AccountsList accounts={this.props.accounts} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
  };
}

AccountsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(AccountsListContainer);
