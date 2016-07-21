import React, { Component, PropTypes } from 'react';

class AccountKindOptions extends Component {
  constructor(props, context) {
    super(props, context);

    this.setKindToImap = this.setKindToImap.bind(this);
  }
  setKindToImap() {
    this.props.setKind('imap');
  }
  renderImapKind() {
    return (<div className="col-md-3">
      <div className={`account-kind-option text-center ${this.props.account.kind === 'imap' ? 'selected' : ''}`} onClick={this.setKindToImap}>
        <div className="icon"><span className="fa fa-envelope-o"></span></div>
        <div>IMAP</div>
      </div>
    </div>);
  }
  renderGoogleKind() {
    return (<div className="col-md-3">
      <a className="account-kind-option" href={this.props.authUrls.googleAuthUrl}>
        <img role="presentation" src="/img/gmail_logo.png" />
      </a>
    </div>);
  }
  renderKindOptions() {
    return (<div>
      {this.renderGoogleKind()}
      {this.renderImapKind()}
    </div>);
  }
  render() {
    return (<div className="account-kind-options">
      <h4>Which type of email would you like to connect?</h4>
      <div className="row">
        {this.renderKindOptions()}
      </div>
    </div>);
  }
}

AccountKindOptions.propTypes = {
  account: PropTypes.object,
  setKind: PropTypes.func.isRequired,
  authUrls: PropTypes.object.isRequired,
};

export default AccountKindOptions;
