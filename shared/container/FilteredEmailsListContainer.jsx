import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredEmailsList from '../components/FilteredEmailsList';
import _ from 'lodash';
import { sortedEmails } from '../helpers';

class FilteredEmailsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectEmail = this.selectEmail.bind(this);
    this.deselectEmail = this.deselectEmail.bind(this);
    this.setCurrentFilteredEmail = this.setCurrentFilteredEmail.bind(this);

    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  setCurrentFilteredEmail(email) {
    this.props.dispatch(Actions.fetchCurrentFilteredAccountEmail(this.props.currentAccount._id, email.id));
  }
  selectEmail(email) {
    this.props.dispatch(Actions.addIdToSelectedFilteredEmailIds(email.id));
  }
  deselectEmail(email) {
    this.props.dispatch(Actions.removeIdFromSelectedFilteredEmailIds(email.id));
  }
  selectAll() {
    const nonCompilationEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !this.props.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', true));
  }
  deselectAll() {
    const nonCompilationEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !this.props.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', false));
  }
  isSavingEmails() {
    return _.some(this.props.filteredAccountEmails, (email) => { return email.saving; });
  }
  render() {
    return (
      <div>
        <FilteredEmailsList
          emails={sortedEmails(this.props.filteredAccountEmails)}
          compilationEmailMids={this.props.compilationEmailMids}
          currentFilteredEmail={this.props.currentFilteredAccountEmail}
          deselectEmail={this.deselectEmail}
          selectEmail={this.selectEmail}
          setCurrentFilteredEmail={this.setCurrentFilteredEmail}
          selectedIds={this.props.selectedFilteredEmailIds}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmails: store.filteredAccountEmails,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
    currentFilteredAccountEmail: store.currentFilteredAccountEmail,
  };
}

FilteredEmailsListContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  currentAccount: PropTypes.object.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  currentFilteredAccountEmail: PropTypes.object,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(FilteredEmailsListContainer);
