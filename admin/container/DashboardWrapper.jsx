import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import Header from '../components/Header';

class DashboardWrapper extends Component { // eslint-disable-line
  render() {
    return (<div className="dashboard-wrapper">
      <Header />
      <div className="container">
        {this.props.children}
      </div>
    </div>);
  }
}

DashboardWrapper.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getUsers.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getOrders.bind(null, cookie)();
  },
];

DashboardWrapper.propTypes = {
  children: PropTypes.object,
};

export default connect()(DashboardWrapper);
