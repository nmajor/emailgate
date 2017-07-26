import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class PromoCodeFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { error: undefined };

    this.submit = this.submit.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  handleError(err) {
    this.setState({ error: err.message });
  }
  submit() {
    this.props.dispatch(Actions.applyPromoCodeToCart(this.props.cart, this.refs.promo.value, (res) => {
      this.handleError(res);
    }));
  }
  renderError() {
    if (this.state.error) {
      return (<div className="text-danger text-right">{this.state.error}</div>);
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
      {this.renderError()}
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
