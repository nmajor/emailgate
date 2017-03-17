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
    return;
    // return (<div className="col-sm-3">
    //   <div className={`account-kind-option text-center ${this.props.account.kind === 'imap' ? 'selected' : ''}`} onClick={this.setKindToImap}>
    //     <span className="icon"><span className="fa fa-envelope-o"></span></span> <span>IMAP</span>
    //   </div>
    // </div>);
  }
  renderGoogleKind() {
    return (<div className="col-sm-3">
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
    return (<div className="account-kind-options bottom-bumper">
      <div className="row">
        <div className="col-sm-12">
          <h5>Click below to connect your Gmail account</h5>
        </div>
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
