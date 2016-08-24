import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import FilterForm from '../components/GoogleFilterForm';

class GoogleFilterFormContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.validate = this.validate.bind(this);
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

    if (_.isEmpty(errors)) {
      return true;
    }

    this.props.dispatch(Actions.setFilteredAccountEmailsErrors(errors));
    return false;
  }
  submitForm(props) {
    if (this.validate(props)) {
      const filter = {
        subject: props.subject,
        to: props.to,
        from: props.from,
        startDate: props.startDate,
        endDate: props.endDate,
      };

      this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, filter));
    }
  }
  render() {
    return (<FilterForm
      submitForm={this.submitForm}
      fetching={this.props.fetching.filteredAccountEmails}
      count={this.props.filteredAccountEmailsResults.count}
      errors={this.props.filteredAccountEmailsResults.errors}
    />);
  }
}

function mapStateToProps(store) {
  return {
    fetching: store.fetching,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
  };
}

GoogleFilterFormContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  fetching: PropTypes.object.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(GoogleFilterFormContainer);
