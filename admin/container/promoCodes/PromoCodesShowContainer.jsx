import React, { PropTypes, Component } from 'react';
import PromoCodeView from '../../components/promoCodes/PromoCodeView';

class PromoCodesShowContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>Promo Code</h1>
      <PromoCodeView promoCode={this.props.promoCode} />
    </div>);
  }
}

PromoCodesShowContainer.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodesShowContainer;
