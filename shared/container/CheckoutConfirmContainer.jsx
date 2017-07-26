import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Header from '../components/Header';
import AddressListItem from '../components/AddressListItem';
import CartView from '../components/CartView';
import BillingInfoSummary from '../components/BillingInfoSummary';
import OrderForm from '../components/OrderForm';
import Loading from '../components/Loading';
import { buffCart } from '../helpers';
import * as Actions from '../redux/actions/index';

class CheckoutConfirmContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      submitting: false,
      error: null,
    };

    this.shippingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.shippingAddressId; });
    this.billingAddress = _.find(this.props.addresses, (address) => { return address._id === this.props.checkout.billingAddressId; });

    if (!this.props.checkout.orderPreview) {
      this.getOrderPreview();
    }

    this.submitOrder = this.submitOrder.bind(this);
    // this.submitPromoCode = this.submitPromoCode.bind(this);
    this.back = this.back.bind(this);
    this.getOrderPreview = this.getOrderPreview.bind(this);
    this.orderProps = this.orderProps.bind(this);
  }
  componentWillMount() {
    if (!this.props.checkout.stripeToken) {
      this.context.router.push('/checkout');
    }
  }
  componentDidMount() {
    if (this.props.compilations.length < 1 && !this.props.fetching.compilations) {
      this.props.dispatch(Actions.getCompilations());
    }
  }
  getOrderPreview() {
    this.props.dispatch(Actions.getOrderPreview(this.orderProps(), (res) => {
      if (res.error) {
        this.setState({ error: res.error });
      }
    }));
  }
  // submitPromoCode(cart, code, cb) {
  //   const orderPreview = this.props.checkout.orderPreview;
  //   orderPreview.cartId = cart._id;
  //   this.props.dispatch(Actions.applyPromoCodeToOrderPreview(orderPreview, code, cb));
  // }
  orderProps() {
    return {
      cartId: this.props.cart._id,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      data: {
        stripeToken: this.props.checkout.stripeToken,
      },
    };
  }
  back() {
    this.context.router.goBack();
  }
  submitOrder(props) {
    const orderProps = this.orderProps();
    orderProps.data.terms = props.terms;

    this.setState({ submitting: true, error: null });
    this.props.dispatch(Actions.createOrder(orderProps, (order) => {
      this.setState({ submitting: false });

      if (!order.error) {
        this.props.dispatch(Actions.getCart());
        this.redirectToView(order);
      } else {
        console.log('blah order.error', order.error);
        this.setState({ error: order.error });
      }
    }));
  }
  redirectToView(order) {
    this.context.router.push(`/orders/${order._id}`);
  }
  renderCartSummary() {
    if (this.props.checkout.orderPreview && !this.props.checkout.orderPreview.fetching) {
      return (<CartView
        cart={buffCart(this.props.checkout.orderPreview, this.props.compilations, this.props.config.products)}
        editable={false}
      />);
    }

    return <span className="alone-loading"><Loading /></span>;
  }
  renderShippingAddress() {
    if (this.shippingAddress) {
      return (<div>
        <h3>Ship To:</h3>
        <div className="selected-address">
          <AddressListItem address={this.shippingAddress} />
        </div>
      </div>);
    }
  }
  renderBillingInfoSummary() {
    if (this.props.checkout.stripeToken) {
      return (<div>
        <h3>Bill To:</h3>
        <BillingInfoSummary billingInfo={this.props.checkout.stripeToken} />
      </div>);
    }
  }
  renderOrderForm() {
    return (<OrderForm
      submit={this.submitOrder}
      back={this.back}
      submitting={this.state.submitting}
      error={this.state.error}
    />);
  }
  render() {
    return (<div>
      <Header hideCart />
      <div className="container">
        <div className="checkout-confirm">
          <h1 className="marginless-top">Confirm Order</h1>
          <div className="row">
            <div className="col-md-6">
              {this.renderShippingAddress()}
            </div>
            <div className="col-md-6">
              {this.renderBillingInfoSummary()}
            </div>
          </div>
          <div>
            <h3>Order Summary</h3>
            {this.renderCartSummary()}
          </div>
          {this.renderOrderForm()}
        </div>
      </div>
    </div>);
  }
}

CheckoutConfirmContainer.need = [
  (params, cookie) => {
    return Actions.getCompilations.bind(null, cookie)();
  },
];

function mapStateToProps(store) {
  return {
    compilations: store.compilations,
    config: store.config,
    addresses: store.addresses,
    checkout: store.checkout,
    cart: store.cart,
    fetching: store.fetching,
  };
}

CheckoutConfirmContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CheckoutConfirmContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  compilations: PropTypes.array.isRequired,
  checkout: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  fetching: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CheckoutConfirmContainer);
