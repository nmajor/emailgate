import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import AccountsList from '../components/AccountsList';
import AccountsListItem from '../components/AccountsListItem';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.unsetAccount = this.unsetAccount.bind(this);
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.currentAccountId });
  }
  unsetAccount() {
    this.props.dispatch(Actions.setCurrentAccountId(''));
  }
  handleItemClick(account) {
    if (account._id !== this.props.currentAccountId) {
      this.props.dispatch(Actions.setCurrentAccountId(account._id));
    }
  }
  handleDeleteClick(account) {
    this.props.dispatch(Actions.removeAccount(account));
  }
  renderHeaderText() {
    if (this.props.accounts.length > 0) {
      return 'Select an email account';
    }

    return 'Add an email account to begin';
  }
  renderSelectAccount() {
    if (this.props.currentAccountId) {
      return (<AccountsListItem
        account={this.currentAccount}
        handleDeleteClick={this.handleDeleteClick}
        googleAuthUrl={this.props.config.googleAuthUrl}
      />);
    }

    return (<AccountsList
      accounts={this.props.accounts}
      selectable
      currentAccountId={this.props.currentAccountId}
      onItemClick={this.handleItemClick}
      onDeleteClick={this.handleDeleteClick}
      googleAuthUrl={this.props.config.googleAuthUrl}
    />);
  }
  renderChangeAction() {
    if (this.props.currentAccountId) {
      return <span className="btn btn-default btn-xs btn-h" onClick={this.unsetAccount}>Change</span>;
    }
  }
  render() {
    return (<div className="accounts-list-container">
      <h3>{this.renderHeaderText()} {this.renderChangeAction()}</h3>
      {this.renderSelectAccount()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    accounts: store.accounts,
    currentAccountId: store.currentAccountId,
  };
}

SelectAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  currentAccountId: PropTypes.string,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(SelectAccountContainer);
