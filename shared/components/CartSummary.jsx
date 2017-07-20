import React, { Component, PropTypes } from 'react';

class CartSummary extends Component {
  renderCartItem(item) {
    const { compilation } = item.props;

    return (<div className="item">
      <div className="image">
        <img role="presentation" src={compilation.thumbnail.url} />
      </div>
      <div className="details">
        <div className="title">{compilation.title}</div>
        <div className="desc">{item.product.shortDesc}</div>
        <div className="price">${item.product.prettyPrice} x {item.quantity}</div>
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
  renderDiscount() {
    if (this.props.cart._promoCode) {
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
};

export default CartSummary;
