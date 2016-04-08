import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(account) {
    if (account._id !== this.props.currentAccountId) {
      this.props.dispatch(Actions.getAccountMailboxes(account));
      this.props.dispatch(Actions.setCurrentAccountId(account._id));
    }
  }

  render() {
    return (
      <div className="accounts-list-container">
        <h3>Select Account</h3>
        <AccountsList
          accounts={this.props.accounts}
          selectable
          currentAccountId={this.props.currentAccountId}
          onItemClick={this.handleItemClick}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    currentAccountId: store.currentAccountId,
  };
}

SelectAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccountId: PropTypes.string,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(SelectAccountContainer);
