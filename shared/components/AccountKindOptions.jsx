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
    return <div onClick={this.setKindToImap}>Imap</div>;
  }
  renderGoogleKind() {
    return <a href={this.props.authUrls.googleAuthUrl}>Google</a>;
  }
  renderKindOptions() {
    return (<div>
      {this.renderGoogleKind()}
      {this.renderImapKind()}
    </div>);
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-sm-8">
          {this.renderKindOptions()}
        </div>
      </div>
    );
  }
}

AccountKindOptions.propTypes = {
  account: PropTypes.object,
  setKind: PropTypes.func.isRequired,
  authUrls: PropTypes.object.isRequired,
};

export default AccountKindOptions;
