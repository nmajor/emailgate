import React, { Component, PropTypes } from 'react';

class AccountKindOptions extends Component {
  constructor(props, context) {
    super(props, context);

    this.setKindToImap = this.setKindToImap.bind(this);
    this.handleGoogleKindClick = this.handleGoogleKindClick.bind(this);
  }
  setKindToImap() {
    this.props.setKind('imap');
  }
  handleGoogleKindClick() {
    const ReactGA = require('../ga').default; // eslint-disable-line
    ReactGA.event({
      category: 'Compilation',
      action: 'Connect Gmail Account Clicked',
    });
    fbq('track', 'ConnectAccount'); // eslint-disable-line no-undef
  }
  renderImapKind() {
    // return (<div className="col-sm-3">
    //   <div className={`account-kind-option text-center ${this.props.account.kind === 'imap' ? 'selected' : ''}`} onClick={this.setKindToImap}>
    //     <span className="icon"><span className="fa fa-envelope-o"></span></span> <span>IMAP</span>
    //   </div>
    // </div>);
  }
  renderGoogleKind() {
    return (<div className="col-sm-3">
      <a className="account-kind-option" href={this.props.authUrls.googleAuthUrl} onClick={this.handleGoogleKindClick}>
        <img role="presentation" src="/img/gmail_logo.png" />
      </a>
    </div>);
  }
  renderMyldsmailKind() {
    // return (<div className="col-sm-3">
    //   <a className="account-kind-option" href={this.props.authUrls.myldsmailAuthUrl} onClick={this.handleGoogleKindClick}>
    //     <img role="presentation" src="/img/gmail_logo.png" />
    //   </a>
    // </div>);
  }
  renderHelpLink() {
    return (<span>
      If you dont see your email provider listed here, <a href="https://missionarymemoir.freshdesk.com/support/tickets/new">please contact us so we can add it</a>.
    </span>);
  }
  renderKindOptions() {
    return (<div>
      {this.renderGoogleKind()}
      {this.renderMyldsmailKind()}
      {this.renderImapKind()}
    </div>);
  }
  render() {
    return (<div className="account-kind-options bottom-bumper">
      <div className="row">
        <div className="col-sm-12">
          <h5>Click below to connect your Gmail account</h5>
        </div>
        {this.renderKindOptions()}
      </div>
      <div className="row">
        <div className="col-sm-12">
          {this.renderHelpLink()}
        </div>
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
