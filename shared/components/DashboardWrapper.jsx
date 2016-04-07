import React, { Component } from 'react';
import Header from '../components/Header';
import AccountsListContainer from '../container/AccountsListContainer';
import CompilationsListContainer from '../container/CompilationsListContainer';

class DashboardWrapper extends Component {
  render() {
    return (
      <div className="dashboard-wrapper">
        <Header />
        <div className="container">
          <h1>Dashboard</h1>
          <CompilationsListContainer />
          <AccountsListContainer />
        </div>
      </div>
    );
  }
}

export default DashboardWrapper;
