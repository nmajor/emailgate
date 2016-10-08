import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../redux/actions/index';
import _ from 'lodash';
import NewAccountContainer from './NewAccountContainer';
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
    this.context.router.push(`/compilations/${this.props.compilation._id}/build/add-emails`);
  }
  selectAccount(account) {
    if (account._id !== this.props.currentAccountId) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/build/add-emails/${account._id}`);
    }
  }
  handleDeleteClick(account) {
    this.props.dispatch(Actions.removeAccount(account));
  }
  renderNewAccountAction() {
    return (<Link to={`/compilations/${this.props.compilation._id}/build/add-emails/new-account`} className="btn btn-success btn-xs-true new-account" >add a new one</Link>);
  }
  renderFooter() {
    if (this.currentAccount) { return null; }

    if (this.props.accounts.length > 0) {
      return <div>Select an existing email account or {this.renderNewAccountAction()}</div>;
    }

    return <NewAccountContainer />;
  }
  renderSelectAccount() {
    if (this.currentAccount) {
      return (<SelectAccountListItem
        selected
        selectAccount={this.selectAccount}
        deselectAccount={this.deselectAccount}
        account={this.currentAccount}
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
      {this.renderSelectAccount()}
      {this.renderFooter()}
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    config: store.config,
    accounts: store.accounts,
  };
}

SelectAccountContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

SelectAccountContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  compilation: PropTypes.object.isRequired,
  currentAccountId: PropTypes.string,
  accounts: PropTypes.array,
};

export default connect(mapStateToProps)(SelectAccountContainer);
