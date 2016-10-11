import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ImapFilterFormContainer from './ImapFilterFormContainer';
import GoogleFilterFormContainer from './GoogleFilterFormContainer';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.allSelected = this.allSelected.bind(this);
    this.addSelected = this.addSelected.bind(this);
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmails([]));
    this.props.dispatch(Actions.setSelectedFilteredEmailIds([]));
    this.props.dispatch(Actions.setCurrentFilteredEmailMid(''));
    this.props.dispatch(Actions.setFilteredAccountEmailsCount(undefined));
    this.props.dispatch(Actions.setFilteredAccountEmailsErrors(undefined));
  }
  selectAll() {
    const nonCompilationEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === email.id; });
    });

    const filteredEmailIds = nonCompilationEmails.map((email) => { return email.id; });
    const selectedEmailIds = this.props.selectedFilteredEmailIds;
    const emailIds = _.union(filteredEmailIds, selectedEmailIds);
    this.props.dispatch(Actions.setSelectedFilteredEmailIds(emailIds));
  }
  deselectAll() {
    const filteredEmailIds = this.props.filteredAccountEmails.map((email) => { return email.id; });
    const selectedEmailIds = this.props.selectedFilteredEmailIds;
    const emailIds = _.filter(selectedEmailIds, (id) => { return filteredEmailIds.indexOf(id) < 0; });
    this.props.dispatch(Actions.setSelectedFilteredEmailIds(emailIds));
  }
  allSelected() {
    const nonCompilationSelectedEmailIds = _.filter(this.props.selectedFilteredEmailIds, (id) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === id; });
    });

    const nonCompilationFilteredAccountEmails = _.filter(this.props.filteredAccountEmails, (email) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === email.id; });
    });

    return !_.some(nonCompilationFilteredAccountEmails, (email) => { return nonCompilationSelectedEmailIds.indexOf(email.id) < 0; });
  }
  addSelected() {
    const nonCompilationSelectedEmailIds = _.filter(this.props.selectedFilteredEmailIds, (id) => {
      return !_.some(this.props.compilationEmails, (cEmail) => { return cEmail.remote_id === id; });
    });

    this.props.dispatch(Actions.addEmailsToCompilationEmailsById(this.props.compilation._id, this.props.currentAccount._id, nonCompilationSelectedEmailIds));
  }
  renderFilterForm() {
    if (this.props.currentAccount.kind === 'imap') {
      return (<ImapFilterFormContainer
        currentAccount={this.props.currentAccount}
        selectAll={this.selectAll}
      />);
    } else if (this.props.currentAccount.kind === 'google') {
      return (<GoogleFilterFormContainer
        currentAccount={this.props.currentAccount}
        addSelected={this.addSelected}
        selectAll={this.selectAll}
        deselectAll={this.deselectAll}
        allSelected={this.allSelected()}
        addSelected={this.addSelected}
        done={this.props.done}
      />);
    }
  }
  render() {
    return (
      <div className="filter-container">
        {this.renderFilterForm()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    compilationEmails: store.compilationEmails,
    filteredAccountEmails: store.filteredAccountEmails,
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentAccount: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  done: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(FilterContainer);
