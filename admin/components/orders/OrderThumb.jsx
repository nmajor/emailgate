import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { prettyPrice } from '../../../shared/helpers';
import moment from 'moment';

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
  render() {
    return (<div className={this.props.className}>
      {this.renderAcion()}
      <Link to={`/orders/${this.props.order._id}`}>{this.props.order._id}</Link>
      <span className="left-bumper">{this.props.order.shippingAddress.firstName} {this.props.order.shippingAddress.lastName}</span>
      <span className="left-bumper">{moment(this.props.order.createdAt).format('LL')}</span>
      <span className="left-bumper">${prettyPrice(this.props.order.amount)}</span>
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
