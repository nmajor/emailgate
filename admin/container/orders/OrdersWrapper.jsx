import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/index';
import _ from 'lodash';

class OrdersWrapper extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.order = _.find(this.props.orders, { _id: this.props.params.orderId });
  }
  componentDidMount() {
    if (this.props.orders.length === 0) {
      this.props.dispatch(Actions.getOrders());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.order = _.find(nextProps.orders, { _id: nextProps.params.orderId });
  }
  renderChildren() {
    if (this.props.children && this.props.orders) {
      return React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, { order: this.order, orders: this.props.orders });
      });
    }
  }
  render() {
    return <div>{this.renderChildren()}</div>;
  }
}

OrdersWrapper.need = [
  (params, cookie) => {
    return Actions.getOrders.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    orders: store.orders,
  };
}

OrdersWrapper.propTypes = {
  children: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(OrdersWrapper);
