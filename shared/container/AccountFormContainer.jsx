import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import AccountForm from '../components/AccountForm';
import base64 from 'base-64';

class AccountFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.authUrls = this.authUrls.bind(this);
  }

  authUrls() {
    const userReturnTo = window.previousLocation ? window.previousLocation.pathname : '/dashboard';

    const stateParam = JSON.stringify({ userReturnTo });

    const stateString = base64.encode(stateParam);
    return {
      googleAuthUrl: `${this.props.config.googleAuthUrl}&state=${stateString}`,
    };
  }

  render() {
    return (<AccountForm
      account={this.props.account}
      submitForm={this.props.submitForm}
      back={this.props.back}
      checkConnection={this.props.checkConnection}
      authUrls={this.authUrls()}
    />);
  }
}

AccountFormContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(store) {
  return {
    config: store.config,
  };
}

AccountFormContainer.propTypes = {
  config: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  checkConnection: PropTypes.func,
};

export default connect(mapStateToProps)(AccountFormContainer);
