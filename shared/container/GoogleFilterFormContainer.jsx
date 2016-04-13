import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/GoogleFilterForm';

class GoogleFilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
  }
  submitForm(props) {
    const filter = {
      subject: props.subject,
      to: props.to,
      from: props.from,
      startDate: props.startDate,
      endDate: props.endDate,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, filter));
  }
  render() {
    return (<FilterForm
      submitForm={this.submitForm}
      fetching={this.props.fetchingFilteredAccountEmails}
    />);
  }
}

function mapStateToProps(store) {
  return {
    fetchingFilteredAccountEmails: store.fetchingFilteredAccountEmails,
  };
}

GoogleFilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  fetchingFilteredAccountEmails: PropTypes.bool,
};

export default connect(mapStateToProps)(GoogleFilterContainer);
