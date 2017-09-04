import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import * as Actions from '../redux/actions/index';
import ScreencastHelper from '../components/ScreencastHelper';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import ImapAccountPasswordFormContainer from './ImapAccountPasswordFormContainer';
import ReconnectGoogleAccount from '../components/ReconnectGoogleAccount';
import FixedFooter from '../components/FixedFooter';
import Loading from '../components/Loading';
import { connect } from 'react-redux';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.back = this.back.bind(this);

    this.compilation = this.props.compilation;
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.params.accountId });
    this.userReturnTo = this.userReturnTo.bind(this);
    this.renderFixedFooter = this.renderFixedFooter.bind(this);
    this.renderFixedFooterAlert = this.renderFixedFooterAlert.bind(this);
    this.addSelected = this.addSelected.bind(this);
    this.hideHelp = this.hideHelp.bind(this);
    this.showHelp = this.showHelp.bind(this);

    const setting = _.find(props.config.settings, (s) => { return s.name === 'addEmailsScreencastHelp'; });
    this.screencastUrl = _.get(setting, 'value.videoUrl');
  }
  // componentWillMount() {
  //   if (this.props.accounts.length === 0) {
  //     this.context.router.push(`/compilations/${this.props.compilation._id}/build/new-account`);
  //   }
  // }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.params.accountId });
  }
  hideHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showAddHelp: false }));
  }
  showHelp() {
    this.props.dispatch(Actions.updateUserAppState({ showAddHelp: true }));
  }
  addSelected() {
    const nonCompilationSelectedEmailIds = _.filter(this.props.selectedFilteredEmailIds, (id) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === id; });
    });

    this.props.dispatch(Actions.removeIdsFromSelectedFilteredEmailIds(this.props.selectedFilteredEmailIds));
    this.props.dispatch(Actions.addEmailsToCompilationEmailsById(this.props.compilation._id, this.currentAccount._id, nonCompilationSelectedEmailIds));
  }
  back() {
    this.context.router.push(`/compilations/${this.props.compilation._id}/build`);
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/add-emails`;
  }
  firstTimer() {
    return this.props.compilationEmails.length === 0;
  }
  showResults() {
    return this.currentAccount
      && this.currentAccount.connectionValid
      && this.props.filteredAccountEmailsResults.count !== undefined;
  }
  showFixedFooter() {
    return this.showResults() && this.props.filteredAccountEmailsResults.count > 0;
  }
  showFixedFooterAlert() {
    return (this.showFixedFooter() && this.props.filteredAccountEmailsResults.nextPageToken);
  }
  renderFixedFooterAlert() {
    const clickNextPage = () => {
      document.getElementById('filtered-emails-next-link').click();
    };

    return (<div className="row">
      <div className="col-xs-12">
        More un-added emails on the <span onClick={clickNextPage} className="btn-link pointer">next page</span>.
      </div>
    </div>);
  }
  renderAddingMessage() {
    if (this.props.addingFilteredEmailIds.length > 0) {
      return (<span className="right-bumper message">
        <span className="button-loading"><Loading /> Adding {this.props.addingFilteredEmailIds.length} emails</span>
      </span>);
    }
  }
  renderFixedFooter() {
    if (this.showResults()) {
      return (<FixedFooter>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-right">
              {this.renderAddingMessage()}
              <button className="btn btn-success" onClick={this.addSelected}>Add {this.props.selectedFilteredEmailIds.length > 0 ? <strong>{this.props.selectedFilteredEmailIds.length}</strong> : <span className="glyphicon glyphicon-check" aria-hidden="true"></span>} Email{this.props.selectedFilteredEmailIds.length > 1 || this.props.selectedFilteredEmailIds.length === 0 ? 's' : ''} to Email Book</button>
            </div>
          </div>
        </div>
      </FixedFooter>);
    }
  }
  renderFilterContainer() {
    if (this.currentAccount) {
      if (this.currentAccount.kind === 'imap' && !this.currentAccount.connectionValid) {
        return <ImapAccountPasswordFormContainer currentAccount={this.currentAccount} />;
      } else if (this.currentAccount.kind === 'google' && !_.get(this.currentAccount, 'authProps.token.refresh_token') && (new Date).getTime() > _.get(this.currentAccount, 'authProps.token.expiry_date')) {
        return <ReconnectGoogleAccount userReturnTo={this.userReturnTo()} account={this.currentAccount} googleAuthUrl={this.props.config.googleAuthUrl} />;
      }
      return <FilterContainer compilation={this.props.compilation} currentAccount={this.currentAccount} done={this.back} />;
    }
  }
  renderFilteredAccountEmailsContainer() {
    if (this.showResults()) {
      return <FilteredAccountEmailsContainer compilation={this.compilation} currentAccount={this.currentAccount} />;
    }
  }
  renderSelectAccount() {
    return <SelectAccountContainer compilation={this.props.compilation} currentAccountId={this.props.params.accountId} />;
  }
  renderHeader() {
    if (this.currentAccount) {
      return <h3 className="text-center">Find some emails to add to your Email Book</h3>;
    }

    if (this.props.accounts.length > 0) {
      return <h3 className="text-center">Pick an email account to search</h3>;
    }

    return null;
  }
  renderScreencastHelper() {
    if (this.screencastUrl) {
      return (<ScreencastHelper videoUrl={this.screencastUrl} hide={this.hideHelp} show={this.showHelp} visible={this.props.user.appState.showAddHelp}>
        <h1>Welcome to the Add Emails page!</h1>
        <div className="flex-center">
          <p>In this page you can connect your email accounts, and use our filtering tools to find the emails you want to include in your Email Book.</p>
        </div>
      </ScreencastHelper>);
    }
  }
  render() {
    return (<div className="container compilation-container">
      {this.renderScreencastHelper()}
      <div className="compilation-content-box">
        {this.renderHeader()}
        {this.renderSelectAccount()}
        {this.renderFilterContainer()}
        {this.renderFilteredAccountEmailsContainer()}
        {this.renderFixedFooter()}
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
    config: store.config,
    accounts: store.accounts,
    compilationEmails: store.compilationEmails,
    filteredAccountEmails: store.filteredAccountEmails,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
    addingFilteredEmailIds: store.addingFilteredEmailIds,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  addingFilteredEmailIds: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
