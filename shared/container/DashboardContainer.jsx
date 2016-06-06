import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import Header from '../components/Header';
import AccountsListContainer from '../container/AccountsListContainer';
import CompilationsListContainer from '../container/CompilationsListContainer';
import OrdersListContainer from '../container/OrdersListContainer';
import { Link } from 'react-router';
import Loading from '../components/Loading';

class DashboardContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
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
  renderDashboard() {
    if (this.props.fetching.compilations) {
      return <span className="alone-loading"><Loading /></span>;
    } else if (this.props.compilations.length < 1) {
      return (<div className="first-step col-md-6">
        <h4>Create a new compilation to get started.</h4>
        <Link to="/compilations/new" className="btn btn-lg btn-success" >
          New Compilation
        </Link>
      </div>);
    }

    return (<div>
      <CompilationsListContainer />
      <AccountsListContainer />
      <OrdersListContainer />
    </div>);
  }
  render() {
    return (
      <div className="dashboard-wrapper">
        <Header />
        <div className="container">
          <h1>Dashboard</h1>
          {this.renderDashboard()}
        </div>
      </div>
    );
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
