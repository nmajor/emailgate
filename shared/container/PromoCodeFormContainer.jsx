import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class PromoCodeFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { error: undefined };

    this.submit = this.submit.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.sitewideSaleSetting = _.find(props.config.settings, (setting) => { return setting.name === 'sitewideSale'; });
  }
  componentDidMount() {
    if (_.get(this.sitewideSaleSetting, 'value.code') && !_.get(this.props.cart, '_promoCode.code')) {
      this.submit(_.get(this.sitewideSaleSetting, 'value.code'));
    } else if (_.get(this.props.cart, '_promoCode.code') && new Date(_.get(this.props.cart, '_promoCode').expiresAt) < new Date()) {
      this.submit(_.get(this.sitewideSaleSetting, 'value.code'));
    }
  }
  handleError(err) {
    this.setState({ error: err.message });
  }
  submit(code) {
    this.props.dispatch(Actions.applyPromoCodeToCart(this.props.cart, (code), (res) => {
      this.handleError(res);
    }));
  }
  handleSubmitClick() {
    this.submit(this.refs.promo.value);
  }
  renderError() {
    if (this.state.error) {
      return (<div className="text-danger text-right">{this.state.error}</div>);
    }
  }
  renderSaleBanner() {
    if (_.get(this.sitewideSaleSetting, 'value.code') && _.get(this.sitewideSaleSetting, 'value.code') !== _.get(this.props.cart, '_promoCode.code')) {
      return (<div className="checkout-sale-message">
        <div>{_.get(this.sitewideSaleSetting, 'value.desc')}</div>
        <div className="top-bumper">Use promo code {'"'}<span className="code">{_.get(this.sitewideSaleSetting, 'value.code')}</span>{'"'} for {_.get(this.sitewideSaleSetting, 'value.discount')}% OFF!</div>
      </div>);
    } else if (_.get(this.sitewideSaleSetting, 'value.code')) {
      return (<div className="checkout-sale-message">
        <div>We have automatically applied the promo code {'"'}<span className="code">{_.get(this.sitewideSaleSetting, 'value.code')}</span>{'"'} to give you {_.get(this.sitewideSaleSetting, 'value.discount')}% OFF!</div>
      </div>);
    }
  }
  render() {
    return (<div>
      {this.renderSaleBanner()}
      <div className="input-group">
        <input type="text" ref="promo" className="form-control" defaultValue={_.get(this.props.cart, '_promoCode.code')} placeholder="Promo Code" />
        <span className="input-group-btn">
          <button onClick={this.handleSubmitClick} className="btn btn-primary marginless-right" type="button">Apply</button>
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
    config: store.config,
  };
}

PromoCodeFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  submitPromoCode: PropTypes.func,
};

export default connect(mapStateToProps)(PromoCodeFormContainer);
