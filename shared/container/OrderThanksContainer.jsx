import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import _ from 'lodash';
import * as Actions from '../redux/actions/index';
import Loading from '../components/Loading';
import OrderView from '../components/OrderView';
import { buffCart } from '../helpers';

class OrderThanksContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.order = _.find(this.props.orders, { _id: this.props.params.id }) || {};
  }
  componentDidMount() {
    if (this.props.orders.length < 1) {
      this.props.dispatch(Actions.getOrders());
    }
  }
  componentWillReceiveProps(nextProps) {
    this.order = _.find(nextProps.orders, { _id: nextProps.params.id }) || {};
  }
  renderView() {
    if (this.props.fetching.orders) {
      return <span className="alone-loading"><Loading /></span>;
    } else if (this.order) {
      return <OrderView order={buffCart(this.order, this.props.compilations, this.props.config.products)} products={this.props.config.products} />;
    }
  }

  render() {
    return (<div>
      <Header />
      <div className="container">
        <div className="order-thanks">
          <h1>Thank you for your order!</h1>
          <p>Your custom printed Mission Email Book is on its way!</p>
          <p>It should arrive in about 2-3 weeks.</p>
        </div>
        {this.renderView()}
      </div>
    </div>);
  }
}

OrderThanksContainer.need = [
  (params, cookie) => {
    return Actions.getOrders.bind(null, cookie)();
  },
  (params, cookie) => {
    return Actions.getCompilations.bind(null, null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    orders: store.orders,
    fetching: store.fetching,
    compilations: store.compilations,
    config: store.config,
  };
}

OrderThanksContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  fetching: PropTypes.object.isRequired,
  compilations: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(OrderThanksContainer);
