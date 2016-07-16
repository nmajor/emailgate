import React, { PropTypes, Component } from 'react';
import base64 from 'base64url';

class AccountExpiryLabel extends Component {
  renderGoogleAuthUrl() {
    const userReturnTo = window.previousLocation ? window.previousLocation.pathname : '/dashboard';
    const stateParam = JSON.stringify({ userReturnTo });
    const stateString = base64.encode(stateParam);

    return `${this.props.googleAuthUrl}&login_hint=${this.props.account.email}&state=${stateString}`;
  }
  render() {
    return (<div className="padded-box top-bumper">
      <div className="bottom-bumper">Our access to your email account {this.props.account.email} has expired.</div>
      <a href={this.renderGoogleAuthUrl()} className="btn btn-warning right-bumper">
        Click here to reconnect
      </a>
    </div>);
  }
}

AccountExpiryLabel.propTypes = {
  account: PropTypes.object.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
};

export default AccountExpiryLabel;
