import React, { PropTypes, Component } from 'react';
import CartItemForm from './CartItemForm';
import _ from 'lodash';
import { prettyPrice } from '../helpers';
import Loading from './Loading';
import { Link } from 'react-router';
import PromoCodeFormContainer from '../container/PromoCodeFormContainer';

class CartView extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleCheckoutClick = this.handleCheckoutClick.bind(this);
  }
  handleCheckoutClick() {
    fbq('track', 'InitiateCheckout'); // eslint-disable-line no-undef
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
          <th style={{ width: '23%' }} className={this.props.editable ? 'text-center' : 'text-right'}>Item Total</th>
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
    if (this.props.cart._promoCode && this.props.cart._promoCode.kind === 'voucher' && this.props.cart.unusedProductVouchers && this.props.cart.unusedProductVouchers.length > 0) {
      return (<div>
        <div className="btn btn-success right-most disabled">Checkout</div>
        <div className="helper-text text-danger">Please claim all of your voucher items to continue</div>
      </div>);
    } else if (this.props.cart.items && this.props.cart.items.length > 0) {
      return <Link to="/checkout" className="btn btn-success right-most" onClick={this.handleCheckoutClick}>Checkout</Link>;
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
  renderVoucherNotice() {
    if (this.props.cart._promoCode && this.props.cart._promoCode.kind === 'voucher') {
      let unclaimedVoucherNotice = 'You have claimed all the items for this Voucher Code';

      const productVouchers = this.props.cart._promoCode.productVouchers.map((voucher, index) => {
        const product = _.find(this.props.products, { _id: parseInt(voucher.productId, 10) });

        return <span key={index}>{voucher.quantity} x {product.desc}</span>;
      });

      if (this.props.cart.unusedProductVouchers && this.props.cart.unusedProductVouchers.length > 0) {
        const unusedVouchers = this.props.cart.unusedProductVouchers.map((unusedVoucher, index) => {
          const product = _.find(this.props.products, { _id: parseInt(unusedVoucher.productId, 10) });

          return <span key={index}>{unusedVoucher.quantity} x {product.desc}</span>;
        });

        unclaimedVoucherNotice = (<div>Unclaimed voucher items: {unusedVouchers}</div>);
      }

      return (<div className="text-center voucher-notice" colSpan={4}>
        <div>Your voucher code "<span className="text-bold">{this.props.cart._promoCode.code}</span>" is good for the following items:</div>
        <div>{productVouchers}</div>
        <div>{unclaimedVoucherNotice}</div>
      </div>);
    }
  }
  renderDiscount() {
    if (!this.props.cart._promoCode) return null;
    if (this.props.cart._promoCode && this.props.cart._promoCode.kind === 'voucher') return null;

    return (<tr>
      <td colSpan="3" className="text-right text-bold">Discount:</td>
      <td className="text-right text-danger">
        <span className="label label-danger" style={{ padding: '2px 4px' }}>%{this.props.cart._promoCode.discount}</span> -  ${this.props.cart.prettyDiscountedAmount}</td>
      {this.renderActionFooter()}
    </tr>);
  }
  renderItemTotal() {
    return (<tr>
      <td colSpan="3" className="text-right text-bold">Subtotal:</td>
      <td className={`text-bold ${this.props.editable ? 'text-center' : 'text-right'}`}>
        ${this.props.cart.prettyItemsTotal}
      </td>
      {this.renderActionFooter()}
    </tr>);
  }
  renderTotal() {
    return (<tr>
      <td></td>
      <td></td>
      <td colSpan="2" className={`text-bold ${this.props.editable ? 'text-center' : 'text-right'}`}>
        Total: ${this.props.cart.prettyTotal}
      </td>
      {this.renderActionFooter()}
    </tr>);
  }
  renderTableFooter() {
    return (<tfoot>
      {this.renderItemTotal()}
      {this.renderDiscount()}
      {this.renderShipping()}
      {this.renderTax()}
      {this.renderTotal()}
    </tfoot>);
  }
  renderPromoCodeForm() {
    if (this.props.showPromoCode) {
      return (<div className="row">
        <div className="col-sm-4 col-sm-offset-8">
          <PromoCodeFormContainer />
        </div>
      </div>);
    }
  }
  render() {
    return (<div>
      <table id="cart" className={`table ${this.props.editable ? 'table-hover' : ''} table-condensed marginless-bottom`}>
        {this.renderTableHeader()}
        <tbody>
          {this.renderItemForms()}
        </tbody>
        {this.renderTableFooter()}
      </table>
      {this.renderVoucherNotice()}
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
  showPromoCode: PropTypes.bool,
  editable: PropTypes.bool,
};

export default CartView;
