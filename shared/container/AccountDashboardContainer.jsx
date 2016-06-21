import React, { Component } from 'react';
import UpdatePasswordContainer from './UpdatePasswordContainer';
import AddressListContainer from './AddressListContainer';

class AccountDashboardContainer extends Component { // eslint-disable-line
  renderPasswordContainer() {
    return (<div className="row">
      <div className="col-md-6">
        <div className="box">
          <UpdatePasswordContainer />
        </div>
      </div>
    </div>);
  }
  renderAddressList() {
    return (<div className="row top-bumper">
      <div className="col-md-6">
        <div className="box">
          <h3>Addresses</h3>
          <AddressListContainer />
        </div>
      </div>
    </div>);
  }
  render() {
    return (<div className="dashboard-wrapper">
      <div className="container">
        <h1>Manage Account</h1>
        {this.renderPasswordContainer()}
        {this.renderAddressList()}
      </div>
    </div>);
  }
}

export default AccountDashboardContainer;
