import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { prettyPrice } from '../../../shared/helpers';
import moment from 'moment';
import _ from 'lodash';

class OrderThumb extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.action = this.action.bind(this);
  }
  action() {
    this.props.action(this.props.order._id);
  }
  renderAcion() {
    if (this.props.action) {
      return (<button
        className="btn btn-xs-true btn-default"
        onClick={this.action}
      >{this.props.renderActionIcon()}</button>);
    }
  }
  renderCartItemProps() {
    if (this.props.order.items.length > 0 && _.some(this.props.order.items, (item) => { return item.props.compilation; })) {
      const itemProps = this.props.order.items.map((item) => {
        return (<div key={item._id}>
          <Link to={`/compilations/${item.props.compilationId}`}>{item.props.compilation._id}</Link>
          {item.props.compilation.pdf ? <span>Has PDF</span> : <span>No PDF</span>}
        </div>);
      });

      return (<div>
        {itemProps}
      </div>);
    }
  }
  render() {
    return (<div className={this.props.className}>
      <div>
        {this.renderAcion()}
        <Link to={`/orders/${this.props.order._id}`}>{this.props.order._id}</Link>
        <span className="left-bumper">{this.props.order.shippingAddress.firstName} {this.props.order.shippingAddress.lastName}</span>
        <span className="left-bumper">${prettyPrice(this.props.order.amount)}</span>
        <span className="left-bumper">{moment(this.props.order.createdAt).format('LL')}</span>
        <span className="left-bumper">{moment(this.props.order.createdAt).fromNow()}</span>
      </div>
      {this.renderCartItemProps()}
    </div>);
  }
}

OrderThumb.propTypes = {
  className: PropTypes.string,
  order: PropTypes.object.isRequired,
  action: PropTypes.func,
  renderActionIcon: PropTypes.func,
};

export default OrderThumb;
