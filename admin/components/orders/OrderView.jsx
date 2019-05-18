import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import { prettyPrice } from '../../../shared/helpers';
import JsonViewer from '../JsonViewer';

class OrderView extends Component { // eslint-disable-line
  renderItems() {
    return _.map(this.props.order.items, (item) => {
      return (<div key={item._id} className="item">
        ${prettyPrice(item.product.price)} x {item.quantity} <Link to={`/compilations/${item.props.compilationId}`}>{item.props.compilationName || item.props.compilationTitle}</Link> - {item.product.desc}
      </div>);
    });
  }
  renderPurchaseOrderLink() {
    if (this.props.order._purchaseOrder) {
      return (<div>
        <hr />
        <Link to={`/purchase-orders/${this.props.order._purchaseOrder}`}>Purchase Order</Link>
      </div>);
    }
  }
  renderDetails() {
    return (<div>
      <div className="bottom-bumper">Created: {moment(this.props.order.createdAt).format('LL')} - {moment(this.props.order.createdAt).fromNow()}</div>
      {this.renderItems()}
      <div>${prettyPrice(this.props.order.shipping)} Shippping</div>
      <div>${prettyPrice(this.props.order.tax)} Tax</div>
      <hr />
      <div>${prettyPrice(this.props.order.amount)} Total</div>
      {this.renderPurchaseOrderLink()}
    </div>);
  }
  renderAddressSummary(address) {
    return (<div>
      <div>{address.firstName} {address.lastName}</div>
      <div>{address.address1}</div>
      <div>{address.address2}</div>
      <div>{address.city}, {address.region} {address.postalCode}</div>
    </div>);
  }
  render() {
    // UPS Ground Residential: UPSGSRNA
    // UPS Next Day Air Residential: UPSNDAR
    // UPS Second Day Air Residential: UPSSDAR
    const { order } = this.props;
    return (<div>
      <div>
        <h3>Details</h3>
        {this.renderDetails()}
      </div>
      <div>
        <div>Shipping Method</div>
        <div className="btn-group" role="group" aria-label="...">
          <button onClick={() => this.props.setOrderShippingMethod('UPSGSRNA')} type="button" className={`btn btn-${order.shippingMethod === 'UPSGSRNA' ? 'primary' : 'default'}`}>UPSGSRNA - UPS Ground Residential</button>

          <button onClick={() => this.props.setOrderShippingMethod('UPSSDAR')} type="button" className={`btn btn-${order.shippingMethod === 'UPSSDAR' ? 'primary' : 'default'}`}>UPSSDAR - UPS Second Day Air Residential</button>

          <button onClick={() => this.props.setOrderShippingMethod('UPSNDAR')} type="button" className={`btn btn-${order.shippingMethod === 'UPSNDAR' ? 'primary' : 'default'}`}>UPSNDAR - UPS Next Day Air Residential</button>
        </div>
      </div>
      <div>
        <h3>Shipping Address</h3>
        {this.renderAddressSummary(this.props.order.billingAddress)}
      </div>
      <div>
        <h3>Billing Address</h3>
        {this.renderAddressSummary(this.props.order.billingAddress)}
      </div>
      <hr />
      <div>
        <JsonViewer obj={this.props.order} />
      </div>
    </div>);
  }
}

OrderView.propTypes = {
  order: PropTypes.object.isRequired,
  setOrderShippingMethod: PropTypes.func.isRequired,
};

export default OrderView;
