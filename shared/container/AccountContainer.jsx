import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import Header from '../components/Header';
import UpdatePasswordContainer from './UpdatePasswordContainer';
import AddressListContainer from './AddressListContainer';

class AccountContainer extends Component { // eslint-disable-line
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
      <Header />
      <div className="container">
        <h1>Account</h1>
        {this.renderPasswordContainer()}
        {this.renderAddressList()}
      </div>
    </div>);
  }
}

// DashboardContainer.need = [
//   (params, cookie) => {
//     return Actions.getAccounts.bind(null, cookie)();
//   },
//   (params, cookie) => {
//     return Actions.getCompilations.bind(null, cookie)();
//   },
//   (params, cookie) => {
//     return Actions.getOrders.bind(null, cookie)();
//   },
// ];
//
// function mapStateToProps(store) {
//   return {
//     compilations: store.compilations,
//     accounts: store.accounts,
//     orders: store.orders,
//     fetching: store.fetching,
//   };
// }
//
// AccountContainer.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   compilations: PropTypes.array.isRequired,
//   accounts: PropTypes.array.isRequired,
//   orders: PropTypes.array.isRequired,
//   fetching: PropTypes.object.isRequired,
// };

export default AccountContainer;
