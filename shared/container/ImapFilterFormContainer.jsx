import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import FilterForm from '../components/ImapFilterForm';

class ImapFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
  }
  validate(props) {
    const errors = {};

    if (!props.startDate) {
      errors.startDate = ['This field is required'];
    }

    if (!props.endDate) {
      errors.endDate = ['This field is required'];
    }

    if (!props.mailbox) {
      errors.mailbox = ['This field is required'];
    }

    if (_.isEmpty(errors)) {
      return true;
    }

    this.props.dispatch(Actions.setFilteredAccountEmailsErrors(errors));
    return false;
  }
  submitForm(props) {
    if (this.validate(props)) {
      const filter = {
        mailbox: props.mailbox,
        subject: props.subject,
        to: props.to,
        from: props.from,
        startDate: props.startDate,
        endDate: props.endDate,
      };

      this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, filter, this.props.accountPasswordMap[this.currentAccount._id]));
    }
  }
  render() {
    return (<FilterForm
      submitForm={this.submitForm}
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
