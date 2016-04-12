import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class NewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
    this.redirectToEdit = this.redirectToEdit.bind(this);
  }

  create(props) {
    this.props.dispatch(Actions.createAccount({
      imap: {
        email: props.email,
        password: props.password,
        host: props.host,
        port: props.port,
      },
    }, this.redirectToEdit));
  }

  redirectToEdit(account) {
    this.context.router.push(`/accounts/${account._id}/edit`);
  }

  back() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="new-account-container">
        <Header />
        <div className="container">
          <h1>Connect New Account</h1>
          <AccountFormContainer account={{}} submitForm={this.create} back={this.back} />
        </div>
      </div>
    );
  }
}

NewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NewAccountContainer);
