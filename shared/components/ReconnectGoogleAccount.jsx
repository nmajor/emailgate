import React, { PropTypes, Component } from 'react';
import base64 from 'base64url';

class AccountExpiryLabel extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleExpiryClick = this.handleExpiryClick.bind(this);
    this.googleAuthUrl = this.googleAuthUrl.bind(this);
  }
  handleExpiryClick() {
    const googleAuthUrl = this.googleAuthUrl();
    window.location = googleAuthUrl;
  }
  googleAuthUrl() {
    const userReturnTo = window.location.pathname ? window.location.pathname : '/dashboard';
    const stateParam = JSON.stringify({ userReturnTo });
    const stateString = base64.encode(stateParam);

    return `${this.props.googleAuthUrl}&login_hint=${this.props.account.email}&state=${stateString}`;
  }
  render() {
    return (<div className="padded-box top-bumper">
      <div className="bottom-bumper">Our access to your email account {this.props.account.email} has expired.</div>
      <div onClick={this.handleExpiryClick} className="btn btn-warning right-bumper">
        Click here to reconnect
      </div>
    </div>);
  }
}

AccountExpiryLabel.propTypes = {
  account: PropTypes.object.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
};

export default AccountExpiryLabel;
