import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class PromoCodesListItem extends Component { // eslint-disable-line
  render() {
    return (<div>
      <Link to={`/promo-codes/${this.props.promoCode._id}`}>
        {this.props.promoCode._id}
      </Link>
    </div>);
  }
}

PromoCodesListItem.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodesListItem;
