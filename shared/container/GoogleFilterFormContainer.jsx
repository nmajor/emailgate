import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/GoogleFilterForm';
import FilteredEmailsActions from './FilteredEmailsActions';
// import _ from 'lodash';

class GoogleFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      filter: {},
      currentPage: 0,
    };

    this.submitForm = this.submitForm.bind(this);
    this.currentAccount = this.props.currentAccount;
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmailsResults({}));
  }
  submitForm(props) {
    this.state.filter = {
      q: props.q || this.state.filter.q,
      pageToken: props.pageToken,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, this.state.filter));
  }
  render() {
    return (<div>
      <FilterForm
        submitForm={this.submitForm}
        fetching={this.props.fetching.filteredAccountEmails}
        errors={this.props.filteredAccountEmailsResults.errors}
      />
      <FilteredEmailsActions
        submitForm={this.submitForm}
        selectAll={this.props.selectAll}
        deselectAll={this.props.deselectAll}
        allSelected={this.props.allSelected}
        addSelected={this.props.addSelected}
        done={this.props.done}
      />
    </div>);
  }
}

function mapStateToProps(store) {
  return {
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
  allSelected: PropTypes.bool.isRequired,
  addSelected: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(GoogleFilterFormContainer);
