import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import * as Actions from '../redux/actions/index';
import FilterForm from '../components/FilterForm';
import _ from 'lodash';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectedAccount = _.find(this.props.accounts, { _id: this.props.selectedAccountId }) || {};
  }
  componentWillReceiveProps(nextProps) {
    this.selectedAccount = _.find(this.props.accounts, { _id: nextProps.selectedAccountId }) || {};
  }

  selectedAccountMailboxes() {
    if (!this.selectedAccount || !this.selectedAccount.imap) { return []; }

    return this.selectedAccount.imap.mailboxes;
  }
  render() {
    return (
      <div className="filter-container">
        <h3>Filter</h3>
        <FilterForm mailboxes={this.selectedAccountMailboxes()} />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    selectedAccountId: store.selectedAccountId,
  };
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  selectedAccountId: PropTypes.string,
};

export default connect(mapStateToProps)(FilterContainer);
