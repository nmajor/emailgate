import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import SelectAccountList from '../components/SelectAccountList';
import SelectAccountListItem from '../components/SelectAccountListItem';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.selectAccount = this.selectAccount.bind(this);
    this.deselectAccount = this.deselectAccount.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.currentAccountId });
  }
  deselectAccount() {
    this.props.dispatch(Actions.setCurrentAccountId(''));
  }
  selectAccount(account) {
    if (account._id !== this.props.currentAccountId) {
      this.props.dispatch(Actions.setCurrentAccountId(account._id));
    }
  }
  handleDeleteClick(account) {
    this.props.dispatch(Actions.removeAccount(account));
  }
  renderHeaderText() {
    if (this.props.currentAccountId) { return null; }

    if (this.props.accounts.length > 0) {
      return 'Select an email account';
    }

    return 'Add an email account to begin';
  }
  renderSelectAccount() {
    if (this.props.currentAccountId) {
      return (<SelectAccountListItem
        selected
        selectAccount={this.selectAccount}
        deselectAccount={this.deselectAccount}
        account={this.currentAccount}
        handleDeleteClick={this.handleDeleteClick}
        googleAuthUrl={this.props.config.googleAuthUrl}
      />);
    }

    return (<SelectAccountList
      accounts={this.props.accounts}
      currentAccountId={this.props.currentAccountId}
      selectAccount={this.selectAccount}
      deselectAccount={this.deselectAccount}
      onDeleteClick={this.handleDeleteClick}
      googleAuthUrl={this.props.config.googleAuthUrl}
    />);
  }
  render() {
    return (<div className="accounts-list-container">
      <h3>{this.renderHeaderText()}</h3>
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
