import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import ShippingAddressContainer from './ShippingAddressContainer';
import BillingAddressContainer from './BillingAddressContainer';
import BillingInfoContainer from './BillingInfoContainer';

class CheckoutContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (<div>
      <Header />
      <div className="container">
        <h1>Checkout</h1>
        <ShippingAddressContainer />
        <BillingAddressContainer />
        <BillingInfoContainer />
      </div>
    </div>);
  }
}

// function mapStateToProps(store) {
//   return {
//     config: store.config,
//     cart: store.cart,
//   };
// }

CheckoutContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(CheckoutContainer);
