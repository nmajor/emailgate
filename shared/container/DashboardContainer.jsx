import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsListContainer from '../container/AccountsListContainer';
import CompilationsListContainer from '../container/CompilationsListContainer';
import OrdersListContainer from '../container/OrdersListContainer';
import { Link } from 'react-router';
// import Loading from '../components/Loading';

class DashboardContainer extends Component {
  componentDidMount() {
    if (this.props.compilations.length < 1 && !this.props.fetching.compilations) {
      this.props.dispatch(Actions.getCompilations());
    }
    if (this.props.accounts.length < 1 && !this.props.fetching.accounts) {
      this.props.dispatch(Actions.getAccounts());
    }
    if (this.props.orders.length < 1 && !this.props.fetching.orders) {
      this.props.dispatch(Actions.getOrders());
    }
  }
  renderHelp() {
    return (<div className="help">
      <h4>Create a New Email Book</h4>
      <p>To get started, create a new email book.</p>
      <Link to="/compilations/new" className="btn btn-lg btn-success" >
        New Email Book
      </Link>
    </div>);
  }
  renderDashboard() {
    if (!this.props.fetching.compilations && this.props.compilations.length < 1) {
      return <div className="row col-md-6">{this.renderHelp()}</div>;
    }

    return (<div>
      <div>
        <h3>Email Books</h3>
        <CompilationsListContainer />
      </div>
      <div>
        <h3>Email Accounts</h3>
        <AccountsListContainer />
      </div>
      <div>
        <h3>Orders</h3>
        <OrdersListContainer />
      </div>
    </div>);
  }
  render() {
    return (<div className="container-fluid">
      <h1 className="hdash">Dashboard</h1>
      {this.renderDashboard()}
    </div>);
  }
}

DashboardContainer.need = [
  (params, cookie) => {
    return Actions.getAccounts.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getOrders.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    accounts: store.accounts,
    orders: store.orders,
    fetching: store.fetching,
  };
}

DashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilations: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(DashboardContainer);
