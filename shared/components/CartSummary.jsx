import React, { Component, PropTypes } from 'react';

class CartSummary extends Component {
  renderCartItem(item) {
    const { compilation } = item.props;
    console.log('blah ', item);
    return (<div className="item">
      <div className="image">
        <img role="presentation" src={compilation.thumbnail.url} />
      </div>
      <div className="details">
        <div>{compilation.title}</div>
        <div>{item.product.shortDesc}</div>
      </div>
    </div>);
  }
  renderCartItems() {
    return this.props.cart.items.map((item, index) => {
      return <div key={index}>{this.renderCartItem(item)}</div>;
    });
  }
  render() {
    return (<div>
      {this.renderCartItems()}
    </div>);
  }
}

CartSummary.propTypes = {
  cart: PropTypes.object.isRequired,
};

export default CartSummary;
