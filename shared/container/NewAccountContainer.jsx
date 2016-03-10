import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import AccountForm from '../components/AccountForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class NewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  create(props) {
    this.props.dispatch(Actions.createAccount({
      email: props.email,
      password: props.password,
      host: props.host,
      port: props.port,
    }));
  }

  cancel() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div className="new-account-container">
        <Header />
        <div className="container">
          <h1>Connect New Account</h1>
          <AccountForm submitForm={this.create} cancelForm={this.cancel} />
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
