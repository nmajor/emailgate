import React, { PropTypes, Component } from 'react';
import { prettyPrice } from '../helpers';

class CartItemForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { quantity: this.props.cartItem.quantity };
  }
  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;
    this.setState(newState);
  }
  renderProductDesc() {
    return (<td>
      <h4 className="nomargin">{this.props.product.name}</h4>
      <p></p>
    </td>);
  }
  renderProductPrice() {
    return (<td>${prettyPrice(this.props.product.price)}</td>);
  }
  renderItemQuantity() {
    return (<td>
      <input type="number" className="form-control text-center" value={this.state.quantity} />
    </td>);
  }
  renderSubtotal() {
    const subtotal = prettyPrice(this.props.product.price * this.props.cartItem.quantity);
    return (<td className="text-center">
      ${subtotal}
    </td>);
  }
  renderRemoveAction() {
    return (<span className="btn btn-danger btn-xs" onClick={this.handleDeleteClick}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </span>);
  }
  renderRefreshAction() {
    return (<span className="btn btn-info btn-xs" onClick={this.handleDeleteClick}>
      <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    </span>);
  }
  renderActions() {
    return (<td className="actions">
      {this.renderRemoveAction()}
      {this.renderRefreshAction()}
    </td>);
  }
  renderItemForm() {
    return (<div>
      <div>{this.props.product.desc}</div>
      <div>Price: ${prettyPrice(this.props.product.price || 0)}</div>
      <div>Quantity: {this.props.cartItem.quantity}</div>
    </div>);
  }
  render() {
    return (<tr>
      {this.renderProductDesc()}
      {this.renderProductPrice()}
      {this.renderItemQuantity()}
      {this.renderSubtotal()}
      {this.renderActions()}
    </tr>);
  }
}

CartItemForm.propTypes = {
  cartItem: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default CartItemForm;
