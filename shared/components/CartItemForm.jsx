import React, { PropTypes, Component } from 'react';
import { prettyPrice } from '../helpers';
import Loading from './Loading';

class CartItemForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.setFormState = this.setFormState.bind(this);
    this.remove = this.remove.bind(this);
  }
  setFormState(event) {
    const newState = {};
    newState[event.target.getAttribute('name')] = event.target.value;

    this.props.update(this.props.cartItem, newState);
  }
  remove() {
    this.props.remove(this.props.cartItem);
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
    if (this.props.editable !== false) {
      return (<td>
        <input
          name="quantity"
          type="number"
          className="form-control text-center"
          onChange={this.setFormState}
          value={this.props.cartItem.quantity}
        />
      </td>);
    }

    return (<td className="text-center">
      {this.props.cartItem.quantity}
    </td>);
  }
  renderSubtotal() {
    const subtotal = prettyPrice(this.props.product.price * this.props.cartItem.quantity);
    return (<td className={this.props.editable ? 'text-center' : 'text-right'}>
      ${subtotal}
    </td>);
  }
  renderRemoveAction() {
    return (<span className="btn btn-danger btn-xs" onClick={this.remove}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </span>);
  }
  renderActions() {
    if (this.props.editable !== false) {
      if (this.props.cartItem.fetching) {
        return <td className="actions"><Loading /></td>;
      }

      return (<td className="actions">
        {this.renderRemoveAction()}
      </td>);
    }
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
  remove: PropTypes.func,
  update: PropTypes.func,
  editable: PropTypes.bool,
};

export default CartItemForm;
