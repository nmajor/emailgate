import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';
import Loading from '../components/Loading';

class AccountsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentDidMount() {
    if (this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }
  }

  handleDeleteClick(account) {
    this.props.dispatch(Actions.removeAccount(account));
  }
  renderAccountsList() {
    if (this.props.fetching.accounts) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return <AccountsList onDeleteClick={this.handleDeleteClick} accounts={this.props.accounts} />;
  }

  render() {
    return (
      <div className="accounts-list-container">
        <h3>Connected Email Accounts</h3>
        {this.renderAccountsList()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    fetching: store.fetching,
  };
}

AccountsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AccountsListContainer);
