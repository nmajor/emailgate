import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import AccountImapForm from '../components/AccountImapForm';
import AccountKindOptions from '../components/AccountKindOptions';

import base64 from 'base64url';

class AccountFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { account: this.props.account };

    this.authUrls = this.authUrls.bind(this);
    this.setAccountKind = this.setAccountKind.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ account: nextProps.account });
  }
  setAccountKind(kind) {
    const account = this.state.account;
    account.kind = kind;
    this.setState({ account });
  }

  authUrls() {
    // let userReturnTo = window.previousLocation ? window.previousLocation.pathname : '/dashboard';
    let userReturnTo = window.location ? window.location.pathname : '/dashboard';
    userReturnTo = this.props.userReturnTo ? this.props.userReturnTo : userReturnTo;

    const stateParam = JSON.stringify({ userReturnTo });

    const stateString = base64.encode(stateParam);
    return {
      googleAuthUrl: `${this.props.config.googleAuthUrl}&state=${stateString}`,
      myldsmailAuthUrl: `${this.props.config.myldsmailAuthUrl}&state=${stateString}`,
    };
  }
  renderImapForm() {
    if (this.state.account.kind === 'imap') {
      return (<AccountImapForm
        account={this.state.account}
        accountPassword={this.props.accountPasswordMap[this.state.account._id] || ''}
        submitForm={this.props.submitForm}
        back={this.props.back}
        checkConnection={this.props.checkConnection}
      />);
    }
  }
  renderAccountKindOptions() {
    if (this.props.new) {
      return (<AccountKindOptions
        account={this.state.account}
        authUrls={this.authUrls()}
        setKind={this.setAccountKind}
      />);
    }
  }
  renderBackButton() {
    if (this.state.account.kind !== 'imap') {
      return <div className="btn btn-danger" onClick={this.props.back}>Back</div>;
    }
  }
  render() {
    return (<div>
      {this.renderAccountKindOptions()}
      {this.renderImapForm()}
    </div>);
  }
}

AccountFormContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(store) {
  return {
    config: store.config,
    accountPasswordMap: store.accountPasswordMap,
  };
}

AccountFormContainer.propTypes = {
  config: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  accountPasswordMap: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  checkConnection: PropTypes.func,
  new: PropTypes.bool,
  userReturnTo: PropTypes.string,
};

export default connect(mapStateToProps)(AccountFormContainer);
