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
    this.context.router.push(`/compilations/${this.props.compilation._id}/add-emails`);
  }
  selectAccount(account) {
    if (account._id !== this.props.currentAccountId) {
      this.context.router.push(`/compilations/${this.props.compilation._id}/add-emails/${account._id}`);
    }
  }
  handleDeleteClick(account) {
    this.props.dispatch(Actions.removeAccount(account));
  }
  renderNewAccountAction() {
    return (<div className="account-list">
      <Link to={`/compilations/${this.props.compilation._id}/add-emails/new-account`} className="selected-account-list-item new-account-list-item" ><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add a new email account or blog</Link>
    </div>);
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

    if (this.props.accounts.length > 0) {
      return (<div>
        <SelectAccountList
          accounts={this.props.accounts}
          currentAccountId={this.props.currentAccountId}
          selectAccount={this.selectAccount}
          deselectAccount={this.deselectAccount}
          onDeleteClick={this.handleDeleteClick}
          googleAuthUrl={this.props.config.googleAuthUrl}
        />
        {this.renderNewAccountAction()}
      </div>);
    }

    return <NewAccountContainer />;
  }
  render() {
    return (<div className="accounts-list-container">
      {this.renderSelectAccount()}
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
