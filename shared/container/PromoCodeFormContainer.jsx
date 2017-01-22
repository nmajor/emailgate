import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class PromoCodeFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submit = this.submit.bind(this);
  }
  submit() {
    if (this.props.submitPromoCode) {
      this.props.submitPromoCode(this.refs.promo.value);
    } else {
      this.props.dispatch(Actions.applyPromoCodeToCart(this.props.cart._id, this.refs.promo.value));
    }
  }
  render() {
    return (<div>
      <div className="input-group">
        <input type="text" ref="promo" className="form-control" defaultValue={_.get(this.props.cart, '_promoCode.code')} placeholder="Promo Code" />
        <span className="input-group-btn">
          <button onClick={this.submit} className="btn btn-primary marginless-right" type="button">Apply</button>
        </span>
      </div>
    </div>);
  }
}

PromoCodeFormContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(store) {
  return {
    cart: store.cart,
  };
}

PromoCodeFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  submitPromoCode: PropTypes.func,
};

export default connect(mapStateToProps)(PromoCodeFormContainer);
