import React, { PropTypes, Component } from 'react';
import CartItemForm from './CartItemForm';
import _ from 'lodash';
import { cartItemsTotal, prettyPrice } from '../helpers';
import Loading from './Loading';
import { Link } from 'react-router';

class CartForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.getCartTotal = this.getCartTotal.bind(this);
  }
  getCartTotal() {
    return cartItemsTotal(this.props.cart.items, this.props.products);
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
  renderTableFooter() {
    return (<tfoot>
			<tr>
				<td></td>
				<td colSpan="2"></td>
				<td className={this.props.editable ? 'text-center' : 'text-right'}><strong>Total ${prettyPrice(this.getCartTotal())}</strong></td>
        {this.renderActionFooter()}
			</tr>
      {this.renderActions()}
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
  updateItem: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default CartForm;
