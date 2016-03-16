import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/FilterForm';
import _ from 'lodash';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.selectedAccount = _.find(this.props.accounts, { _id: this.props.selectedAccountId }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.selectedAccount = _.find(this.props.accounts, { _id: nextProps.selectedAccountId }) || {};
  }
  submitForm(props) {
    const filter = {
      mailbox: props.mailbox,
      subject: props.subject,
      to: props.to,
      from: props.from,
    };

    this.props.dispatch(Actions.getFilteredAccountEmails(this.selectedAccount, filter));
  }

  selectedAccountMailboxes() {
    if (!this.selectedAccount || !this.selectedAccount.imap) { return []; }

    return this.selectedAccount.imap.mailboxes;
  }
  render() {
    return (
      <div className="filter-container">
        <h3>Filter</h3>
        <FilterForm submitForm={this.submitForm} mailboxes={this.selectedAccountMailboxes()} fetching={this.props.fetchingFilteredAccountEmails} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    selectedAccountId: store.selectedAccountId,
    fetchingFilteredAccountEmails: store.fetchingFilteredAccountEmails,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  selectedAccountId: PropTypes.string,
  fetchingFilteredAccountEmails: PropTypes.bool,
};

export default connect(mapStateToProps)(FilterContainer);
