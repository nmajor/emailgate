import React, { Component } from 'react';
import Header from '../components/Header';
import AccountsListContainer from '../container/AccountsListContainer';

class DashboardWrapper extends Component {
  render() {
    return (
      <div className="dashboard-wrapper">
        <Header />
        <div className="container">
          <h1>Dashboard</h1>
          <AccountsListContainer />
        </div>
      </div>
    );
  }
}

export default DashboardWrapper;
