import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import Modal from '../components/Modal';
import CompilationBuildContainer from './CompilationBuildContainer';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import ImapAccountPasswordFormContainer from './ImapAccountPasswordFormContainer';
import ReconnectGoogleAccount from '../components/ReconnectGoogleAccount';
import AccountFormContainer from './AccountFormContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.back = this.back.bind(this);

    this.compilation = this.props.compilation;
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.params.accountId });
    this.userReturnTo = this.userReturnTo.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.params.accountId });
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/pre-next`);
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/build/add-emails`;
  }
  renderFilterContainer() {
    if (this.currentAccount) {
      if (this.currentAccount.kind === 'imap' && !this.currentAccount.connectionValid) {
        return <ImapAccountPasswordFormContainer currentAccount={this.currentAccount} />;
      } else if (this.currentAccount.kind === 'google' && (new Date).getTime() > _.get(this.currentAccount, 'authProps.token.expiry_date')) {
        return <ReconnectGoogleAccount userReturnTo={this.userReturnTo()} account={this.currentAccount} googleAuthUrl={this.props.config.googleAuthUrl} />;
      }
      return <FilterContainer compilation={this.props.compilation} currentAccount={this.currentAccount} done={this.back} />;
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
      <AccountFormContainer new account={{}} submitForm={this.create} back={this.back} userReturnTo={this.userReturnTo()} />
    </div>);
  }
  renderSelectAccount() {
    if (this.props.accounts.length > 0) {
      return <SelectAccountContainer compilation={this.props.compilation} currentAccountId={this.props.params.accountId} />;
    }

    return <div className="row col-md-6">{this.renderHelp()}</div>;
  }
  renderHeader() {
    if (this.props.compilationEmails.length === 0) {
      return <h3 className="text-center">Next add some emails to your Email Book.</h3>;
    }

    return <h1 className="text-center">Add emails to your Email Book</h1>;
  }
  render() {
    return (<div>
      <CompilationBuildContainer compilation={this.props.compilation} ffooter={false} />;
      <Modal close={this.back}>
        <div>
          {this.renderHeader()}
          {this.renderSelectAccount()}
          {this.renderFilterContainer()}
          {this.renderFilteredAccountEmailsContainer()}
        </div>
      </Modal>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    accounts: store.accounts,
    compilationEmails: store.compilationEmails,
    filteredAccountEmails: store.filteredAccountEmails,
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
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
