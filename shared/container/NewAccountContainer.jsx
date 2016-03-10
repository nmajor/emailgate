import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import AccountForm from '../components/AccountForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

class NewAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
  }

  componentDidUpdate() {
    if (this.props.editingAccount) {
      this.context.router.push(`/accounts/${this.props.editingAccount}/edit`);
    }
  }

  create(props) {
    this.props.dispatch(Actions.createAccount({
      email: props.email,
      password: props.password,
      host: props.host,
      port: props.port,
    }));
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
          <AccountForm submitForm={this.create} cancelForm={this.back} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    editingAccount: store.editingAccount,
  };
}

NewAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

NewAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editingAccount: PropTypes.string,
};

export default connect(mapStateToProps)(NewAccountContainer);
