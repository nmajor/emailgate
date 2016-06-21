import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsListContainer from '../container/AccountsListContainer';

class EmailAccountsDashboardContainer extends Component {
  componentDidMount() {
    if (this.props.accounts.length < 1 && !this.props.fetching.accounts) {
      this.props.dispatch(Actions.getAccounts());
    }
  }
  render() {
    return (<div className="container">
      <h1 className="hdash">Email Accounts</h1>
      <AccountsListContainer />
    </div>);
  }
}

EmailAccountsDashboardContainer.need = [
  (params, cookie) => {
    return Actions.getAccounts.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    fetching: store.fetching,
  };
}

EmailAccountsDashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(EmailAccountsDashboardContainer);
