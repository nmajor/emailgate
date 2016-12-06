import React, { PropTypes, Component } from 'react';
import PromoCodesListItem from './PromoCodesListItem';

class PromoCodesList extends Component {
  renderUsersList() {
    return this.props.promoCodes.map((promoCode) => {
      return <PromoCodesListItem key={promoCode._id} promoCode={promoCode} />;
    });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          {this.renderUsersList()}
        </div>
      </div>
    );
  }
}

PromoCodesList.propTypes = {
  promoCodes: PropTypes.array.isRequired,
};

export default PromoCodesList;
