import React, { PropTypes, Component } from 'react';
import PromoCodeForm from '../../components/promoCodes/PromoCodeForm';

class PromoCodesEditContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Promo Code</h1>
      <PromoCodeForm promoCode={this.props.promoCode} />
    </div>);
  }
}

PromoCodesEditContainer.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodesEditContainer;
