import React, { Component, PropTypes } from 'react';
import PromoCodeFormContainer from '../container/PromoCodeFormContainer';
import _ from 'lodash';

class CartSummary extends Component {
  renderCartItem(item) {
    const { compilation } = item.props;

    let voucher = null;
    if (item.voucher && item.voucher > 0) {
      voucher = <span className="voucher-tag top-bumper">voucher item ( x {item.voucher})</span>;
    }

    return (<div className="item">
      <div className="image">
        <img role="presentation" src={compilation.thumbnail.url} />
      </div>
      <div className="details">
        <div className="title">{compilation.title}</div>
        <div className="desc">{item.product.shortDesc}</div>
        <div className="price">${item.product.prettyPrice} x {item.quantity}</div>
        {voucher}
      </div>
    </div>);
  }
  renderCartItems() {
    return this.props.cart.items.map((item, index) => {
      return <div key={index}>{this.renderCartItem(item)}</div>;
    });
  }
  renderSubtotal() {
    if (this.props.cart._promoCode) {
      return (<div>
        <span className="desc">Subtotal:</span>
        <span className="amount">${this.props.cart.prettyItemsTotal}</span>
      </div>);
    }
  }
  renderVoucherNotice() {
    if (this.props.cart._promoCode.kind === 'voucher') {
      let unclaimedVoucherNotice = null;

      const productVouchers = this.props.cart._promoCode.productVouchers.map((voucher, index) => {
        const product = _.find(this.props.products, { _id: parseInt(voucher.productId, 10) });

        return <span key={index}>{voucher.quantity} x {product.shortDesc}</span>;
      });

      if (this.props.cart.unusedProductVouchers && this.props.cart.unusedProductVouchers.length > 0) {
        const unusedVouchers = this.props.cart.unusedProductVouchers.map((unusedVoucher, index) => {
          const product = _.find(this.props.products, { _id: parseInt(unusedVoucher.productId, 10) });

          return <span key={index}>{unusedVoucher.quantity} x {product.shortDesc}</span>;
        });

        unclaimedVoucherNotice = (<div>Unclaimed voucher items: {unusedVouchers}</div>);
      }

      return (<div className="text-center voucher-notice" colSpan={4}>
        <div>Voucher items:</div>
        <div>{productVouchers}</div>
        <div>{unclaimedVoucherNotice}</div>
      </div>);
    }
  }
  renderDiscount() {
    if (this.props.cart._promoCode && this.props.cart._promoCode.kind !== 'voucher') {
      return (<div>
        <span className="desc">Discount:</span>
        <span className="text-danger amount">
          <span className="label label-danger" style={{ padding: '2px 4px' }}>%{this.props.cart._promoCode.discount}</span> -  ${this.props.cart.prettyDiscountedAmount}
        </span>
        <hr />
      </div>);
    }
  }
  renderTotal() {
    return (<div className="cart-total">
      <span className="desc">Total:</span>
      <span className="amount">${this.props.cart.prettyTotal}</span>
    </div>);
  }
  renderTotals() {
    return (<div className="totals">
      {this.renderVoucherNotice()}
      <PromoCodeFormContainer />
      <hr />
      {this.renderSubtotal()}
      {this.renderDiscount()}
      {this.renderTotal()}
      <div className=""></div>
    </div>);
  }
  render() {
    return (<div>
      {this.renderCartItems()}
      <hr />
      {this.renderTotals()}
    </div>);
  }
}

CartSummary.propTypes = {
  cart: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
};

export default CartSummary;
