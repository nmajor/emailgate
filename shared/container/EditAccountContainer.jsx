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

    this.account = _.find(this.props.accounts, { _id: this.editingAccount });
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.setEditingAccount(''));
  }

  update(props) {
    this.props.dispatch(Actions.updateAccount({
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
    console.log('rendering edit account container');
    console.log(this.account);
    return (
      <div className="new-account-container">
        <Header />
        <div className="container">
          <h1>Edit Account</h1>
          <AccountForm submitForm={this.update} cancelForm={this.back} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    editingAccount: store.editingAccount,
  };
}

EditAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(EditAccountContainer);