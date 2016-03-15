import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.accounts.length < 1) {
      this.props.dispatch(Actions.getAccounts());
    }
  }

  handleItemClick(account) {
    this.props.dispatch(Actions.setSelectedAccountId(account._id));
    this.props.dispatch(Actions.getAccountMailboxes(account));
  }

  render() {
    return (
      <div className="accounts-list-container">
        <h3>Select Account</h3>
        <AccountsList
          accounts={this.props.accounts}
          selectable
          selectedAccountId={this.props.selectedAccountId}
          onItemClick={this.handleItemClick}
        />
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

SelectAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(SelectAccountContainer);
