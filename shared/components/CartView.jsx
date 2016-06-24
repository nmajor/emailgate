import React, { PropTypes, Component } from 'react';
import CartItemForm from './CartItemForm';
// import _ from 'lodash';
import { cartItemsTotal, prettyPrice } from '../helpers';
import Loading from './Loading';
import { Link } from 'react-router';

class CartView extends Component {
  constructor(props, context) {
    super(props, context);

    this.getCartTotal = this.getCartTotal.bind(this);
  }
  getCartTotal() {
    if (this.props.cart.amount) {
      return this.props.cart.amount;
    }

    let amount = cartItemsTotal(this.props.cart.items);
    if (this.props.cart.shipping) {
      amount += this.props.cart.shipping;
    } else if (this.props.cart.shippingEst) {
      amount += this.props.cart.shippingEst;
    }

    if (this.props.cart.tax) {
      amount += this.props.cart.tax;
    }

    return amount;
  }
  renderItemForms() {
    return this.props.cart.items.map((cartItem) => {
      // const product = cartItem.product || _.find(this.props.products, (prod) => {
      //   return parseInt(prod._id, 10) === parseInt(cartItem.productId, 10);
      // });

      return (<CartItemForm
        key={cartItem._id}
        cartItem={cartItem}
        product={cartItem.product}
        remove={this.props.removeItem}
        update={this.props.updateItem}
        editable={this.props.editable}
      />);
    });
  }
  renderActionsHeader() {
    if (this.props.editable !== false) {
      return <th style={{ width: '5%' }}></th>;
    }
  }
  renderTableHeader() {
    if (this.props.cart.items && this.props.cart.items.length > 0) {
      return (<thead>
        <tr>
          <th style={{ width: '52%' }}>Product</th>
          <th style={{ width: '10%' }} >Price</th>
          <th style={{ width: '10%' }} className="text-center">Quantity</th>
          <th style={{ width: '23%' }} className={this.props.editable ? 'text-center' : 'text-right'}>Subtotal</th>
          {this.renderActionsHeader()}
        </tr>
      </thead>);
    }

    return (<thead>
      <tr>
        <th style={{ width: '52%' }}></th>
        <th style={{ width: '10%' }}></th>
        <th style={{ width: '10%' }}></th>
        <th style={{ width: '23%' }}></th>
        {this.renderActionsHeader()}
      </tr>
    </thead>);
  }
  renderContinueShoppingAction() {
    if (this.props.cart.items && this.props.cart.items.length > 0) {
      return <a href="#" className="btn btn-warning left-bumper"><i className="fa fa-angle-left"></i> Continue Shopping</a>;
    }
  }
  renderCheckoutAction() {
    if (this.props.cart.items && this.props.cart.items.length > 0) {
      return <Link to="/checkout" className="btn btn-success left-bumper">Checkout</Link>;
    }
  }
  renderLoading() {
    if (this.props.cart.fetching) {
      return <span className="outside-button-loading"><Loading /></span>;
    }
  }
  renderActionFooter() {
    if (this.props.editable !== false) {
      return <td></td>;
    }
  }
  renderActions() {
    if (this.props.editable !== false) {
      return (<tr>
        <td colSpan="5" className="text-right">
          {this.renderLoading()}
          {this.renderContinueShoppingAction()}
          {this.renderCheckoutAction()}
        </td>
      </tr>);
    }
  }
  renderShipping() {
    if (this.props.cart.shipping || this.props.cart.shippingEst) {
      const amount = this.props.cart.shipping || this.props.cart.shippingEst;
      const desc = this.props.cart.shipping ? 'Shipping' : 'Estimated Shipping';

      return (<tr>
        <td colSpan="3" className="text-right text-bold">{desc}:</td>
        <td className="text-right">${prettyPrice(amount)}</td>
        {this.renderActionFooter()}
      </tr>);
    }
  }
  renderTax() {
    if (this.props.cart.tax) {
      return (<tr>
        <td colSpan="3" className="text-right text-bold">Sales Tax:</td>
        <td className="text-right">${prettyPrice(this.props.cart.tax)}</td>
        {this.renderActionFooter()}
      </tr>);
    }
  }
  renderTotal() {
    return (<tr>
      <td></td>
      <td></td>
      <td colSpan="2" className={`text-bold ${this.props.editable ? 'text-center' : 'text-right'}`}>
        Total: ${prettyPrice(this.getCartTotal())}
      </td>
      {this.renderActionFooter()}
    </tr>);
  }
  renderTableFooter() {
    return (<tfoot>
      {this.renderShipping()}
      {this.renderTax()}
      {this.renderTotal()}
      {this.renderActions()}
    </tfoot>);
  }
  render() {
    return (<table id="cart" className={`table ${this.props.editable ? 'table-hover' : ''} table-condensed`}>
      {this.renderTableHeader()}
      <tbody>
        {this.renderItemForms()}
      </tbody>
      {this.renderTableFooter()}
    </table>);
  }
}

CartView.propTypes = {
  cart: PropTypes.object.isRequired,
  products: PropTypes.array,
  removeItem: PropTypes.func,
  updateItem: PropTypes.func,
  editable: PropTypes.bool,
};

export default CartView;
