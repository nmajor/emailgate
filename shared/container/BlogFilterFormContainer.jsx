import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/BlogFilterForm';
import FilteredEmailsActions from './FilteredEmailsActions';

class BlogFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.state = {
      filter: {},
      currentPage: 0,
    };

    this.currentAccount = this.props.currentAccount;
  }
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmailsResults({}));
  }
  submitForm(props) {
    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, props));
  }
  render() {
    return (<div>
      <FilterForm
        onSubmit={this.submitForm}
        currentAccount={this.currentAccount}
        fetching={this.props.fetching.filteredAccountEmails}
        count={this.props.filteredAccountEmailsResults.count}
        errors={this.props.filteredAccountEmailsResults.errors}
      />
      <FilteredEmailsActions
        submitForm={this.submitForm}
        selectAll={this.props.selectAll}
        deselectAll={this.props.deselectAll}
        selectEverything={this.props.selectEverything}
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
    accountPasswordMap: store.accountPasswordMap,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
  };
}

BlogFilterFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  accountPasswordMap: PropTypes.object.isRequired,
  fetching: PropTypes.object.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  selectEverything: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  addSelected: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(BlogFilterFormContainer);
