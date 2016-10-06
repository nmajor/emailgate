import React, { PropTypes, Component } from 'react';

class AddOrderOptionsListItem extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.addOrder = this.addOrder.bind(this);
  }
  addOrder() {
    this.props.addOrder(this.props.order._id);
  }
  render() {
    return (<div>
      <span>{this.props.order._id}</span>
      <button
        className="btn btn-xs-true btn-success"
        onClick={this.addOrder}
      >Add</button>
    </div>);
  }
}

AddOrderOptionsListItem.propTypes = {
  order: PropTypes.object.isRequired,
  addOrder: PropTypes.func.isRequired,
};

export default AddOrderOptionsListItem;
