import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { buffCart } from '../helpers';
import CartSummary from '../components/CartSummary';
// import * as Actions from '../redux/actions/index';
// import _ from 'lodash';

class CartSummaryContainer extends Component { // eslint-disable-line
  // constructor(props, context) {
  //   super(props, context);
  // }
  render() {
    return (<div className="cart-summary">
      <CartSummary
        cart={buffCart(this.props.cart, this.props.compilations, this.props.config.products)}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    cart: store.cart,
  };
}

CartSummaryContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilations: PropTypes.array.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CartSummaryContainer);
