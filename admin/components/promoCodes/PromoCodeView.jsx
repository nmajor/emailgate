import React, { PropTypes, Component } from 'react';
import PromoCodeTile from './PromoCodeTile';

class PromoCodeView extends Component { // eslint-disable-line
  render() {
    return (<div>
      <PromoCodeTile promoCode={this.props.promoCode} />
    </div>);
  }
}

PromoCodeView.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodeView;
