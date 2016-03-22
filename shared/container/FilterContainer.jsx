import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/FilterForm';
import _ from 'lodash';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(this.props.accounts, { _id: nextProps.currentAccountId }) || {};
  }
  submitForm(props) {
    const filter = {
      mailbox: props.mailbox,
      subject: props.subject,
      to: props.to,
      from: props.from,
      startDate: props.startDate,
      endDate: props.endDate,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.currentAccount, filter));
  }

  currentAccountMailboxes() {
    if (!this.currentAccount || !this.currentAccount.imap) { return []; }

    return this.currentAccount.imap.mailboxes;
  }
  render() {
    return (
      <div className="filter-container">
        <h3>Filter</h3>
        <FilterForm
          submitForm={this.submitForm}
          mailboxes={this.currentAccountMailboxes()}
          fetching={this.props.fetchingFilteredAccountEmails}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    currentAccountId: store.currentAccountId,
    fetchingFilteredAccountEmails: store.fetchingFilteredAccountEmails,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  currentAccountId: PropTypes.string,
  fetchingFilteredAccountEmails: PropTypes.bool,
};

export default connect(mapStateToProps)(FilterContainer);
