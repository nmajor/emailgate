import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/BlogFilterForm';

class ImapFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
  }
  submitForm(props) {
    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, props));
  }
  render() {
    return (<FilterForm
      onSubmit={this.submitForm}
      currentAccount={this.currentAccount}
      fetching={this.props.fetching.filteredAccountEmails}
      count={this.props.filteredAccountEmailsResults.count}
      errors={this.props.filteredAccountEmailsResults.errors}
    />);
  }
}

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    accountPasswordMap: store.accountPasswordMap,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
  };
}

ImapFilterFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  accountPasswordMap: PropTypes.object.isRequired,
  fetching: PropTypes.object.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ImapFilterFormContainer);
