import React, { PropTypes, Component } from 'react';

class PromoCodeView extends Component { // eslint-disable-line
  render() {
    return (<div>
      {JSON.stringify(this.props.promoCode)}
    </div>);
  }
}

PromoCodeView.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodeView;
