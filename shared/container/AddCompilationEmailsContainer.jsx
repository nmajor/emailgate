import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import ImapAccountPasswordFormContainer from './ImapAccountPasswordFormContainer';
import ReconnectGoogleAccount from '../components/ReconnectGoogleAccount';
import { connect } from 'react-redux';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.back = this.back.bind(this);

    this.compilation = this.props.compilation;
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.currentAccountId });
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  renderFilterContainer() {
    if (this.currentAccount) {
      if (this.currentAccount.kind === 'imap' && !this.currentAccount.connectionValid) {
        return <ImapAccountPasswordFormContainer currentAccount={this.currentAccount} />;
      } else if (this.currentAccount.kind === 'google' && (new Date).getTime() > _.get(this.currentAccount, 'authProps.token.expiry_date')) {
        return <ReconnectGoogleAccount account={this.currentAccount} googleAuthUrl={this.props.config.googleAuthUrl} />;
      }
      return <FilterContainer currentAccount={this.currentAccount} />;
    }
  }
  renderFilteredAccountEmailsContainer() {
    if (this.currentAccount
      && this.currentAccount.connectionValid
      && this.props.filteredAccountEmails.length > 0
    ) {
      return <FilteredAccountEmailsContainer compilation={this.compilation} />;
    }
  }
  renderHelp() {
    return (<div className="help">
      <h4>Connect an Email Account</h4>
      <p>First step is to securely connect an email account so can search an add emails to your compilation.</p>
      <Link to="/accounts/new" className="btn btn-lg btn-success new-account" >
        New Account
      </Link>
    </div>);
  }
  renderSelectAccount() {
    if (this.props.accounts.length > 0) {
      return <SelectAccountContainer />;
    }

    return <div className="row col-md-6">{this.renderHelp()}</div>;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <h1 className="text-center">Add Emails</h1>
        {this.renderSelectAccount()}
        {this.renderFilterContainer()}
        {this.renderFilteredAccountEmailsContainer()}
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    accounts: store.accounts,
    filteredAccountEmails: store.filteredAccountEmails,
    currentAccountId: store.currentAccountId,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  currentAccountId: PropTypes.string,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
