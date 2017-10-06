import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/GoogleFilterForm';
import FilteredEmailsActions from './FilteredEmailsActions';
import ReconnectGoogleAccount from '../components/ReconnectGoogleAccount';
// import _ from 'lodash';

class GoogleFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filter: {},
      currentPage: 0,
    };

    this.submitForm = this.submitForm.bind(this);
    this.userReturnTo = this.userReturnTo.bind(this);
    this.currentAccount = this.props.currentAccount;
    this.renderReconnect = this.renderReconnect.bind(this);
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmailsResults({}));
  }
  userReturnTo() {
    return `/compilations/${this.props.compilation._id}/add-emails`;
  }
  submitForm(props) {
    this.state.filter = {
      q: props.q || this.state.filter.q,
      pageToken: props.pageToken,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, this.state.filter));
  }
  renderReconnect() {
    return <ReconnectGoogleAccount userReturnTo={this.userReturnTo()} account={this.currentAccount} googleAuthUrl={this.props.config.googleAuthUrl} />;
  }
  render() {
    return (<div>
      <FilterForm
        submitForm={this.submitForm}
        fetching={this.props.fetching.filteredAccountEmails}
        errors={this.props.filteredAccountEmailsResults.errors}
        renderReconnect={this.renderReconnect}
      />
      <FilteredEmailsActions
        submitForm={this.submitForm}
        selectAll={this.props.selectAll}
        deselectAll={this.props.deselectAll}
        selectEverything={this.props.selectEverything}
        allSelected={this.props.allSelected}
        addSelected={this.props.addSelected}
        done={this.props.done}
        totalEstimate
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    fetching: store.fetching,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    filteredAccountEmails: store.filteredAccountEmails,
  };
}

GoogleFilterFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  fetching: PropTypes.object.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  selectEverything: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  addSelected: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
  config: PropTypes.object,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(GoogleFilterFormContainer);
