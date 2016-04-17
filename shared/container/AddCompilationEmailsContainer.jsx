import React, { PropTypes, Component } from 'react';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import ImapAccountPasswordForm from '../components/ImapAccountPasswordForm';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId });
    this.submitAccountPassword = this.submitAccountPassword.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.currentAccountId });
  }
  submitAccountPassword(props) {
    this.props.dispatch(Actions.setPasswordInAccountPasswordMap(this.currentAccount, props.password));
    this.props.dispatch(Actions.checkAccountConnection(this.currentAccount, props.password));
  }
  renderFilterContainer() {
    if (this.currentAccount) {
      if (this.currentAccount.connectionValid) {
        return <FilterContainer currentAccount={this.currentAccount} />;
      }
      return (<ImapAccountPasswordForm
        submitForm={this.submitAccountPassword}
        password={this.props.accountPasswordMap[this.currentAccount._id]}
        currentAccount={this.currentAccount}
      />);
    }
  }
  renderFilteredAccountEmailsContainer() {
    if (this.currentAccount && this.currentAccount.connectionValid) {
      return <FilteredAccountEmailsContainer compilation={this.compilation} />;
    }
  }
  render() {
    return (
      <div className="edit-account-container container">
        <h1>Add Emails to Compilation</h1>
        <SelectAccountContainer />
        {this.renderFilterContainer()}
        {this.renderFilteredAccountEmailsContainer()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    accountPasswordMap: store.accountPasswordMap,
    compilationEmails: store.compilationEmails,
    currentAccountId: store.currentAccountId,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  accountPasswordMap: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentAccountId: PropTypes.string,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
