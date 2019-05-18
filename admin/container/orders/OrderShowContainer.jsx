import React, { PropTypes, Component } from 'react';
import OrderView from '../../components/orders/OrderView';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';

class OrderShowContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.setOrderShippingMethod = this.setOrderShippingMethod.bind(this);
  }
  setOrderShippingMethod(val) {
    this.props.dispatch(Actions.updateOrder(this.props.order._id, { shippingMethod: val }));
  }
  render() {
    return (<div>
      <h1>Orders</h1>
      <OrderView order={this.props.order} setOrderShippingMethod={this.setOrderShippingMethod} />
    </div>);
  }
}

OrderShowContainer.propTypes = {
  dispatch: PropTypes.func,
  order: PropTypes.object.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(OrderShowContainer);
