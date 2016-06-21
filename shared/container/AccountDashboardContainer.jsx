import React, { Component } from 'react';
import UpdatePasswordContainer from './UpdatePasswordContainer';

class AccountDashboardContainer extends Component { // eslint-disable-line
  renderPasswordContainer() {
    return (<div className="row">
      <div className="col-md-6">
        <UpdatePasswordContainer />
      </div>
    </div>);
  }
  render() {
    return (<div className="dashboard-wrapper">
      <div className="container-fluid">
        <h1 className="hdash">Manage Account</h1>
        {this.renderPasswordContainer()}
      </div>
    </div>);
  }
}

export default AccountDashboardContainer;
