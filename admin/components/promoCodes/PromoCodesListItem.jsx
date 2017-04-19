import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import PromoCodeTile from './PromoCodeTile';

class PromoCodesListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/promo-codes/${this.props.promoCode._id}`}>
        <PromoCodeTile promoCode={this.props.promoCode} />
      </Link>
    </div>);
  }
}

PromoCodesListItem.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodesListItem;
