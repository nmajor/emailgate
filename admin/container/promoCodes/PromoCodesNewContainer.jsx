import React, { PropTypes, Component } from 'react';
import * as Actions from '../../redux/actions/index';
import { connect } from 'react-redux';
import PromoCodeForm from '../../components/promoCodes/PromoCodeForm';
import _ from 'lodash';

class PromoCodesNewContainer extends Component { // eslint-disable-line
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
  }
  create(props) {
    const newProps = {
      code: props.code,
      discount: props.discount,
      expiresAt: props.expiresAt,
      oneTimeUse: props.oneTimeUse,
      freeShipping: props.freeShipping,
    };

    _.forEach({
      premiumColorVoucherQuantity: 3,
      standardColorVoucherQuantity: 1,
      bwColorVoucherQuantity: 4,
    }, (value, key) => {
      if (parseInt(props[key], 10) > 0) {
        newProps.productVouchers = newProps.productVouchers || [];
        newProps.productVouchers.push({
          productId: value,
          quantity: parseInt(props[key], 10),
        });
      }
    });

    if (newProps.productVouchers && newProps.productVouchers.length > 0) {
      newProps.kind = 'voucher';
    } else {
      newProps.kind = 'discount';
    }

    return new Promise((resolve) => {
      this.props.dispatch(Actions.createPromoCode(newProps, (promoCode) => {
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
