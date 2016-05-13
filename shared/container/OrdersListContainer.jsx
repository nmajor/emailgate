import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import OrdersList from '../components/OrdersList';
import Loading from '../components/Loading';

class OrdersListContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (this.props.orders.length < 1 && !this.props.fetching.orders) {
      this.props.dispatch(Actions.getOrders());
    }
  }
  renderOrdersList() {
    if (this.props.fetching.orders) {
      return <span className="alone-loading"><Loading /></span>;
    }

    return <OrdersList orders={this.props.orders} />;
  }

  render() {
    return (
      <div className="orders-list-container">
        <h3>Orders</h3>
        {this.renderOrdersList()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    orders: store.orders,
    fetching: store.fetching,
  };
}

OrdersListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(OrdersListContainer);
