import React, { PropTypes, Component } from 'react';
import CartItemForm from './CartItemForm';
import _ from 'lodash';

class CartForm extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderItemForms() {
    return this.props.cart.items.map((cartItem) => {
      const product = _.find(this.props.products, (prod) => {
        return parseInt(prod._id, 10) === parseInt(cartItem.productId, 10);
      });

      return (<CartItemForm
        key={cartItem._id}
        cartItem={cartItem}
        product={product}
        remove={this.props.removeItem}
        updateQuantity={this.props.updateItemQuantity}
      />);
    });
  }
  renderTableHeader() {
    return (<thead>
      <tr>
        <th style={{ width: '50%' }}>Product</th>
        <th style={{ width: '10%' }} >Price</th>
        <th style={{ width: '8%' }}>Quantity</th>
        <th style={{ width: '22%' }} className="text-center">Subtotal</th>
        <th style={{ width: '10%' }}></th>
      </tr>
    </thead>);
  }
  renderTableFooter() {
    return (<tfoot>
			<tr className="visible-xs">
				<td className="text-center"><strong>Total 1.99</strong></td>
			</tr>
			<tr>
				<td><a href="#" className="btn btn-warning"><i className="fa fa-angle-left"></i> Continue Shopping</a></td>
				<td colSpan="2" className="hidden-xs"></td>
				<td className="hidden-xs text-center"><strong>Total $1.99</strong></td>
				<td><a href="#" className="btn btn-success btn-block">Checkout <i className="fa fa-angle-right"></i></a></td>
			</tr>
		</tfoot>);
  }
  render() {
    return (<table id="cart" className="table table-hover table-condensed">
      {this.renderTableHeader()}
      <tbody>
        {this.renderItemForms()}
      </tbody>
      {this.renderTableFooter()}
    </table>);
  }
}

CartForm.propTypes = {
  cart: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  updateItemQuantity: PropTypes.func.isRequired,
};

export default CartForm;
