import React, { PropTypes, Component } from 'react';
import * as Actions from '../../redux/actions/index';
import { connect } from 'react-redux';
import PromoCodeForm from '../../components/promoCodes/PromoCodeForm';

class PromoCodesNewContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
  }
  create(props) {
    return new Promise((resolve) => {
      this.props.dispatch(Actions.createPromoCode(props, (promoCode) => {
        resolve();
        this.context.router.push(`/promo-codes/${promoCode._id}`);
      }));
    });
  }
  render() {
    return (<div>
      <h1>Promo Code</h1>
      <PromoCodeForm promoCode={{}} onSubmit={this.create} />
    </div>);
  }
}

PromoCodesNewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

PromoCodesNewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PromoCodesNewContainer);
