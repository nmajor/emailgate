import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import OrdersListContainer from '../container/OrdersListContainer';

class OrdersDashboardContainer extends Component {
  componentDidMount() {
    if (this.props.orders.length < 1 && !this.props.fetching.orders) {
      this.props.dispatch(Actions.getOrders());
    }
  }
  render() {
    return (<div>
      <h1>Compilations</h1>
      <OrdersListContainer />
    </div>);
  }
}

OrdersDashboardContainer.need = [
  (params, cookie) => {
    return Actions.getOrders.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    orders: store.orders,
    fetching: store.fetching,
  };
}

OrdersDashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(OrdersDashboardContainer);
