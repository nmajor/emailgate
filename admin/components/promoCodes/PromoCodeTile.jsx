import React, { PropTypes, Component } from 'react';
import moment from 'moment';

class PromoCodeTile extends Component { // eslint-disable-line
  renderExpires() {
    if (this.props.promoCode.expiresAt) {
      return (<div>
        Expires: {moment(this.props.promoCode.expiresAt).format('LLL')} - {moment(this.props.promoCode.expiresAt).fromNow()}
      </div>);
    }
  }
  renderCreated() {
    return (
      <div>
        Created: {moment(this.props.promoCode.createdAt).format('LLL')} - {moment(this.props.promoCode.createdAt).fromNow()}
      </div>
    );
  }
  renderUsage() {
    if (this.props.promoCode.oneTimeUse) {
      return <span> - One Time Use</span>;
    }

    return <span> - Multi Use</span>;
  }
  renderDiscount() {
    return (<span> - {this.props.promoCode.discount}%</span>);
  }
  renderCode() {
    const style = {
      fontWeight: 'bold',
    };
    return (<span style={style}>{this.props.promoCode.code}</span>);
  }
  render() {
    const style = {
      fontSize: '18px',
      marginBottom: '5px',
    };
    return (<div className="padded-box bottom-bumper">
      <div style={style}>{this.renderCode()}{this.renderDiscount()}{this.renderUsage()}</div>
      {this.renderCreated()}
      {this.renderExpires()}
    </div>);
  }
}

PromoCodeTile.propTypes = {
  promoCode: PropTypes.object.isRequired,
};

export default PromoCodeTile;
