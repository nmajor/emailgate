import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import AccountsList from '../components/AccountsList';

class SelectAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
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
    return (<div>
      <h3>{this.renderHeaderText()}</h3>
      <AccountsList
        accounts={this.props.accounts}
        selectable
        currentAccountId={this.props.currentAccountId}
        onItemClick={this.handleItemClick}
        onDeleteClick={this.handleDeleteClick}
        googleAuthUrl={this.props.config.googleAuthUrl}
      />
    </div>);
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
