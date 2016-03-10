import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import AccountsList from '../components/AccountsList';

class AccountsContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.props.dispatch(Actions.getAccounts());
    this.addAccount = this.addAccount.bind(this);
  }

  addAccount(email, password) {
    this.props.dispatch(Actions.loginUser({ email, password }))
    .then((account) => {
      console.log('add account dispatch callback');
      console.log(account);
    });
  }

  render() {
    return (
      <div className="accounts-container">
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

AccountsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(AccountsContainer);
