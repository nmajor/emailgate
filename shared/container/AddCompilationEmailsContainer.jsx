import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import * as Actions from '../redux/actions/index';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import ImapAccountPasswordFormContainer from './ImapAccountPasswordFormContainer';
import ReconnectGoogleAccount from '../components/ReconnectGoogleAccount';
import FixedFooter from '../components/FixedFooter';
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
  }
  componentWillMount() {
    if (this.props.accounts.length === 0) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/new-account`);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.params.accountId });
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
  renderFixedFooter() {
    if (this.showResults()) {
      return (<FixedFooter>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-right">
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
      } else if (this.currentAccount.kind === 'google' && (new Date).getTime() > _.get(this.currentAccount, 'authProps.token.expiry_date')) {
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

    return <h3 className="text-center">Pick an email account to search</h3>;
  }
  render() {
    return (<div className="container compilation-container">
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
    config: store.config,
    accounts: store.accounts,
    compilationEmails: store.compilationEmails,
    filteredAccountEmails: store.filteredAccountEmails,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
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
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
