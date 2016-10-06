import React, { PropTypes, Component } from 'react';

class AddedOrdersListItem extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.removeOrder = this.removeOrder.bind(this);
  }
  removeOrder() {
    this.props.removeOrder(this.props.order._id);
  }
  render() {
    return (<div>
      <span>{this.props.order._id}</span>
      <button
        className="btn btn-xs-true btn-success"
        onClick={this.removeOrder}
      >Remove</button>
    </div>);
  }
}

AddedOrdersListItem.propTypes = {
  order: PropTypes.object.isRequired,
  removeOrder: PropTypes.func.isRequired,
};

export default AddedOrdersListItem;
