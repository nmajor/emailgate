import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import AccountForm from '../components/AccountForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import _ from 'lodash';

class EditAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.back = this.back.bind(this);

    this.account = _.find(this.props.accounts, { _id: this.props.params.id }) || {};
  }

  update(props) {
    this.props.dispatch(Actions.updateAccount(this.props.params.id, {
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
          <h1>Edit Account</h1>
          <AccountForm account={this.account} submitForm={this.update} back={this.back} />
        </div>
      </div>
    );
  }
}

EditAccountContainer.need = [(params, cookie) => {
  return Actions.getAccount.bind(null, params.id, cookie)();
}];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
  };
}

EditAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditAccountContainer);
