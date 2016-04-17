import React, { PropTypes, Component } from 'react';
import ImapAccountPasswordForm from '../components/ImapAccountPasswordForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class ImapAccountPasswordFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.submitAccountPassword = this.submitAccountPassword.bind(this);
  }
  submitAccountPassword(props) {
    this.props.dispatch(Actions.setPasswordInAccountPasswordMap(this.props.currentAccount, props.password));
    this.props.dispatch(Actions.checkAccountConnection(this.props.currentAccount, props.password));
  }
  render() {
    return (<ImapAccountPasswordForm
      submitForm={this.submitAccountPassword}
      password={this.props.accountPasswordMap[this.props.currentAccount._id]}
      currentAccount={this.props.currentAccount}
    />);
  }
}

function mapStateToProps(store) {
  return {
    accountPasswordMap: store.accountPasswordMap,
  };
}

ImapAccountPasswordFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object.isRequired,
  accountPasswordMap: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ImapAccountPasswordFormContainer);
