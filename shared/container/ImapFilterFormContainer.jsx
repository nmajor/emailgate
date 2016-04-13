import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilterForm from '../components/ImapFilterForm';

class ImapFilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);

    this.currentAccount = this.props.currentAccount;
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
    return (<FilterForm
      submitForm={this.submitForm}
      mailboxes={this.currentAccountMailboxes()}
      fetching={this.props.fetchingFilteredAccountEmails}
    />);
  }
}

function mapStateToProps(store) {
  return {
    fetchingFilteredAccountEmails: store.fetchingFilteredAccountEmails,
  };
}

ImapFilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object,
  fetchingFilteredAccountEmails: PropTypes.bool,
};

export default connect(mapStateToProps)(ImapFilterContainer);
