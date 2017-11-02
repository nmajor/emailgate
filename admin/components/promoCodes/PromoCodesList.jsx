import React, { PropTypes, Component } from 'react';
import PromoCodesListItem from './PromoCodesListItem';
import _ from 'lodash';

class PromoCodesList extends Component {
  renderUsersList() {
    return _.sortBy(this.props.promoCodes, (pc) => { return -new Date(pc.createdAt).getTime(); }).map((promoCode) => {
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
