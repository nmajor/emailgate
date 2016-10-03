import React, { PropTypes, Component } from 'react';
import OrderView from '../../components/orders/OrderView';

class OrderShowContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Orders</h1>
      <OrderView order={this.props.order} />
    </div>);
  }
}

OrderShowContainer.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderShowContainer;
