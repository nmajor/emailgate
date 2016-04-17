import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class EditAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.update = this.update.bind(this);
    this.back = this.back.bind(this);
    this.checkConnection = this.checkConnection.bind(this);

    this.account = _.find(this.props.accounts, { _id: this.props.params.id }) || {};
  }

  componentDidMount() {
    this.checkConnectionIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    this.account = _.find(nextProps.accounts, { _id: nextProps.params.id }) || {};
  }

  update(props) {
    this.props.dispatch(Actions.updateAccount(this.props.params.id, {
      email: props.email,
      kind: props.kind,
      authProps: {
        host: props.host,
        port: props.port,
      },
    }, (account) => {
      this.props.dispatch(Actions.setPasswordInAccountPasswordMap(account, props.password));
      this.checkConnectionIfNeeded();
    }));
  }

  checkConnection() {
    this.props.dispatch(Actions.checkAccountConnection(this.account, this.props.accountPasswordMap[this.account._id]));
  }

  checkConnectionIfNeeded() {
    if (this.account.checkingConnection || !this.props.accountPasswordMap[this.account._id] || this.account.connectionValid) { return; }

    this.checkConnection();
  }

  back() {
    if (window.previousLocation && window.previousLocation.pathname === '/accounts/new') {
      this.context.router.go(-2);
    } else {
      this.context.router.go(-1);
    }
  }

  render() {
    return (
      <div className="edit-account-container">
        <Header />
        <div className="container">
          <h1>Edit Account</h1>
          <AccountFormContainer checkConnection={this.checkConnection} account={this.account} submitForm={this.update} back={this.back} />
        </div>
      </div>
    );
  }
}

EditAccountContainer.need = [(params, cookie) => {
  return Actions.getAccounts.bind(null, cookie)();
}];

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    accountPasswordMap: store.accountPasswordMap,
  };
}

EditAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

EditAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  accountPasswordMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(EditAccountContainer);
