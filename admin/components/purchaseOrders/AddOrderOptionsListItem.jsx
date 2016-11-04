import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { prettyPrice } from '../../../shared/helpers';
import moment from 'moment';
import _ from 'lodash';

class AddOrderOptionsListItem extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);

    this.canAdd = this.canAdd.bind(this);
    this.action = this.action.bind(this);
  }
  canAdd() {
    return _.every(this.props.order.items, (item) => { return _.get(item.props, 'compilation.pdf') && _.get(item.props, 'compilation.cover.pdf'); });
  }
  action() {
    if (this.canAdd()) {
      this.props.action(this.props.order._id);
    }
  }
  renderAcion() {
    if (this.canAdd()) {
      return (<button
        className="btn btn-xs-true btn-default"
        onClick={this.action}
      >{this.props.renderActionIcon()}</button>);
    }

    return (<button
      className="btn btn-xs-true btn-danger disabled"
      onClick={this.action}
    >{this.props.renderActionIcon()}</button>);
  }
  renderCartItemProps() {
    if (this.props.order.items.length > 0 && _.some(this.props.order.items, (item) => { return item.props.compilation; })) {
      const itemProps = this.props.order.items.map((item) => {
        const pdfIcon = (<span className={`right-bumper label label-${_.get(item.props, 'compilation.pdf') ? 'success' : 'danger'} label-xs-true`}>
          <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
        </span>);
        const coverPdfIcon = (<span className={`right-bumper label label-${_.get(item.props, 'compilation.cover.pdf') ? 'success' : 'danger'} label-xs-true`}>
          <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
        </span>);
        return (<div key={item._id}>
          Compilation <Link className="right-bumper" to={`/compilations/${item.props.compilationId}`}>{item.props.compilation._id}</Link> {pdfIcon}
          {coverPdfIcon}
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
        <span className="left-bumper">{moment(this.props.order.createdAt).format('LL')}</span>
        <span className="left-bumper">${prettyPrice(this.props.order.amount)}</span>
      </div>
      {this.renderCartItemProps()}
    </div>);
  }
}

AddOrderOptionsListItem.propTypes = {
  className: PropTypes.string,
  order: PropTypes.object.isRequired,
  action: PropTypes.func,
  renderActionIcon: PropTypes.func,
};

export default AddOrderOptionsListItem;
