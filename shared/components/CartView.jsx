import React, { PropTypes, Component } from 'react';
import CartItemForm from './CartItemForm';
import _ from 'lodash';
import { cartItemsTotal, prettyPrice, getDiscountedAmount } from '../helpers';
import Loading from './Loading';
import { Link } from 'react-router';
import PromoCodeFormContainer from '../container/PromoCodeFormContainer';

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

    if (this.props.cart._promoCode) {
      amount -= getDiscountedAmount(this.props.cart._promoCode, cartItemsTotal(this.props.cart.items));
    }

    return amount;
  }
  renderItemForms() {
    if (this.props.cart.items) {
      return this.props.cart.items.map((cartItem) => {
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
    // if (this.props.cart.items && this.props.cart.items.length > 0) {
    //   return <Link to="/dashboard" className="btn btn-warning">Back to Dashboard</Link>;
    // }
  }
  renderCheckoutAction() {
    if (this.props.cart.items && this.props.cart.items.length > 0) {
      return <Link to="/checkout" className="btn btn-success right-most">Checkout</Link>;
    }
  }
  renderLoading() {
    if (this.props.cart.fetching) {
      return <span className="outside-button-loading right-bumper"><Loading /></span>;
    }
  }
  renderActionFooter() {
    if (this.props.editable !== false) {
      return <td></td>;
    }
  }
  renderActions() {
    if (this.props.editable !== false) {
      return (<div className="text-right top-bumper">
        {this.renderLoading()}
        {this.renderContinueShoppingAction()}
        {this.renderCheckoutAction()}
      </div>);
    }
  }
  renderShipping() {
    if (this.props.cart.shipping !== undefined || this.props.cart.shippingEst !== undefined) {
      const amount = this.props.cart.shipping || this.props.cart.shippingEst;
      const desc = this.props.cart.shipping !== undefined ? 'Shipping' : 'Estimated Shipping';

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
  renderDiscount() {
    if (this.props.cart._promoCode) {
      return (<tr>
        <td colSpan="3" className="text-right text-bold">Discount:</td>
        <td className="text-right text-danger">
          <span className="label label-danger" style={{ padding: '2px 4px' }}>%{this.props.cart._promoCode.discount}</span> -  ${prettyPrice(getDiscountedAmount(this.props.cart._promoCode, cartItemsTotal(this.props.cart.items)))}</td>
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
      {this.renderDiscount()}
      {this.renderShipping()}
      {this.renderTax()}
      {this.renderTotal()}
    </tfoot>);
  }
  renderPromoCodeForm() {
    if (!_.get(this.props.cart, 'transaction.id')) {
      return (<div className="row">
        <div className="col-sm-4 col-sm-offset-8">
          <PromoCodeFormContainer submitPromoCode={this.props.submitPromoCode} />
        </div>
      </div>);
    }
  }
  render() {
    return (<div>
      <table id="cart" className={`table ${this.props.editable ? 'table-hover' : ''} table-condensed`}>
        {this.renderTableHeader()}
        <tbody>
          {this.renderItemForms()}
        </tbody>
        {this.renderTableFooter()}
      </table>
      {this.renderPromoCodeForm()}
      {this.renderActions()}
    </div>);
  }
}

CartView.propTypes = {
  cart: PropTypes.object.isRequired,
  products: PropTypes.array,
  removeItem: PropTypes.func,
  updateItem: PropTypes.func,
  submitPromoCode: PropTypes.func,
  editable: PropTypes.bool,
};

export default CartView;
