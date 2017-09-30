import React, { Component, PropTypes } from 'react';

class AccountKindOptions extends Component {
  constructor(props, context) {
    super(props, context);

    this.setKindToImap = this.setKindToImap.bind(this);
    this.setKindToBlog = this.setKindToBlog.bind(this);
    this.handleGoogleKindClick = this.handleGoogleKindClick.bind(this);
  }
  setKindToImap() {
    this.props.setKind('imap');
  }
  setKindToBlog() {
    this.props.setKind('blog');
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
    return (<div>
      <a className="account-kind-option" href={this.props.authUrls.googleAuthUrl} onClick={this.handleGoogleKindClick}>
        <div className="inner">
          <img role="presentation" src="/img/gmail_logo.png" />
        </div>
      </a>
    </div>);
  }
  renderMyldsmailKind() {
    return (<div>
      <a className="account-kind-option" href={this.props.authUrls.myldsmailAuthUrl} onClick={this.handleGoogleKindClick}>
        <div className="inner">
          <span className="icon right-bumper"><span className="glyphicon glyphicon-envelope" aria-hidden="true"></span></span> <span style={{ fontFamily: '"Times New Roman", Georgia, Serif' }}> MyLdsMail</span>
        </div>
      </a>
    </div>);
  }
  renderBlogKind() {
    return (<div>
      <div className={`account-kind-option text-center ${this.props.account.kind === 'blog' ? 'selected' : ''}`} onClick={this.setKindToBlog}>
        <div className="inner">
          <img role="presentation" src="/img/blogger_logo.png" />
        </div>
      </div>
    </div>);
  }
  renderHelpLink() {
    return (<span>
      If you dont see your email or blog provider listed here, <a href="https://missionarymemoir.freshdesk.com/support/tickets/new">please contact us so we can add it</a>.
    </span>);
  }
  render() {
    return (<div>
      <div className="account-kind-options bottom-bumper">
        <div className="row">
          <div className="col-sm-6">
            <h3>Connect an Email account</h3>
              {this.renderGoogleKind()}
              {this.renderMyldsmailKind()}
              {this.renderImapKind()}
          </div>
          <div className="col-sm-6">
            <h3>Connect a blog</h3>
            {this.renderBlogKind()}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12">
            {this.renderHelpLink()}
          </div>
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
