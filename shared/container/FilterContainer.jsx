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
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmails([]));
    this.props.dispatch(Actions.setSelectedFilteredEmailIds([]));
    this.props.dispatch(Actions.setCurrentFilteredEmailMid(''));
    this.props.dispatch(Actions.setFilteredAccountEmailsCount(undefined));
    this.props.dispatch(Actions.setFilteredAccountEmailsErrors(undefined));
  }
  selectAll() {
    const filteredEmailIds = this.props.filteredAccountEmails.map((email) => { return email.id; });
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
    const selectedEmailIds = this.props.selectedFilteredEmailIds;
    return !_.some(this.props.filteredAccountEmails, (email) => { return selectedEmailIds.indexOf(email.id) < 0; });
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
        selectAll={this.selectAll}
        deselectAll={this.deselectAll}
        allSelected={this.allSelected()}
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
    selectedFilteredEmailIds: store.selectedFilteredEmailIds,
    filteredAccountEmails: store.filteredAccountEmails,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object.isRequired,
  selectedFilteredEmailIds: PropTypes.array.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(FilterContainer);
