import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import AccountsList from '../components/AccountsList';

class AccountsContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.addAccount = this.addAccount.bind(this);
  }

  addAccount(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }));
  }

  render() {
    return (
      <div className="accounts-container">
        <h3>Connected Email Accounts</h3>
        <AccountsList userAccounts={this.props.userAccounts} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    userAccounts: store.userAccounts,
  };
}

AccountsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  userAccounts: PropTypes.array,
};

export default connect(mapStateToProps)(AccountsContainer);
