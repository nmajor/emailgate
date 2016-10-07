import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import OrderThumb from '../orders/OrderThumb';
import { prettyPrice } from '../../../shared/helpers';

class PurchaseOrderSummary extends Component { // eslint-disable-line
  renderOrderItems() {
    if (!this.props.purchaseOrder.orders || this.props.purchaseOrder.orders.length === 0) {
      return null;
    }

    return _.flatten(_.map(this.props.purchaseOrder.orders, (order) => {
      const items = _.map(order.items, (item) => {
        return (<div key={item._id} className="item">
          {item.quantity} x <Link to={`/compilations/${item.props.compilationId}`}>{item.props.compilationName || item.props.compilationTitle}</Link> - {item.product.desc}
        </div>);
      });

      return (<div className="purchase-order-order-summary-thumb">
        <OrderThumb className="order" order={order} />
        {items}
      </div>);
    }));
  }
  renderOrderCount() {
    if (!this.props.purchaseOrder.orders || this.props.purchaseOrder.orders.length === 0) {
      return null;
    }

    return <div>Orders: {this.props.purchaseOrder.orders.length}</div>;
  }
  renderOrdersTotal() {
    if (!this.props.purchaseOrder.orders || this.props.purchaseOrder.orders.length === 0) {
      return null;
    }

    const orderAmounts = _.map(this.props.purchaseOrder.orders, (order) => { return order.amount; });
    const ordersTotal = _.reduce(orderAmounts, (sum, amount) => { return sum + amount; });

    return <div>Orders Total: ${prettyPrice(ordersTotal)}</div>;
  }
  render() {
    return (<div>
      <div>Status: {this.props.purchaseOrder.status}</div>
      {this.renderOrderCount()}
      {this.renderOrdersTotal()}
      {this.renderOrderItems()}
    </div>);
  }
}

PurchaseOrderSummary.propTypes = {
  purchaseOrder: PropTypes.object.isRequired,
};

export default PurchaseOrderSummary;
