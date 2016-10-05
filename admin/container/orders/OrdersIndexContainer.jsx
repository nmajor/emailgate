import React, { PropTypes, Component } from 'react';
import OrdersList from '../../components/orders/OrdersList';

class OrdersIndexContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Orders</h1>
      <OrdersList orders={this.props.orders} />
    </div>);
  }
}

OrdersIndexContainer.propTypes = {
  dispatch: PropTypes.func,
  orders: PropTypes.array,
};

export default OrdersIndexContainer;
