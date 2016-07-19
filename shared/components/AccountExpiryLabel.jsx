import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import base64 from 'base64url';

class AccountExpiryLabel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fromNow: moment(this.props.account.authProps.token.expiry_date).fromNow(),
    };

    this.handleExpiryClick = this.handleExpiryClick.bind(this);
    this.googleAuthUrl = this.googleAuthUrl.bind(this);
  }
  componentDidMount() {
    this.startPolling();
  }
  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  startPolling() {
    self._timer = setInterval(() => {
      const fromNow = moment(this.props.account.authProps.token.expiry_date).fromNow();
      if (fromNow !== this.state.fromNow) {
        this.setState({ fromNow: moment(this.props.account.authProps.token.expiry_date).fromNow() });
      }
    }, 15000);
  }
  handleExpiryClick() {
    const googleAuthUrl = this.googleAuthUrl();
    window.location = googleAuthUrl;
  }
  googleAuthUrl() {
    const userReturnTo = _.get(window, 'location.pathname') ? window.location.pathname : '/dashboard';
    const stateParam = JSON.stringify({ userReturnTo });
    const stateString = base64.encode(stateParam);

    return `${this.props.googleAuthUrl}&login_hint=${this.props.account.email}&state=${stateString}`;
  }
  renderExpiration() {
    if (_.get(this.props.account, 'authProps.token.expiry_date')) {
      if ((new Date).getTime() > this.props.account.authProps.token.expiry_date) {
        return (<div onClick={this.handleExpiryClick} className="btn btn-warning right-bumper">
          Expired!
        </div>);
      }

      return (<span className="label label-success right-bumper">
        Expires {this.state.fromNow}
      </span>);
    }

    return <span></span>;
  }
  render() {
    return this.renderExpiration();
  }
}

AccountExpiryLabel.propTypes = {
  account: PropTypes.object.isRequired,
  googleAuthUrl: PropTypes.string.isRequired,
};

export default AccountExpiryLabel;
