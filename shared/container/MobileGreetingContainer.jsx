import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';

class OrdersListContainer extends Component {
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    return (
      <div className="orders-list-container">
        {this.renderOrdersList()}
      </div>
    );
  }
}


export default OrdersListContainer;
