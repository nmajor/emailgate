import React, { PropTypes, Component } from 'react';
import SelectAccountContainer from './SelectAccountContainer';
import FilterContainer from './FilterContainer';
import FilteredAccountEmailsContainer from './FilteredAccountEmailsContainer';
import { connect } from 'react-redux';
import _ from 'lodash';

class AddCompilationEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.compilation = this.props.compilation;
    this.currentAccount = _.find(this.props.accounts, { _id: this.props.currentAccountId });
  }
  componentWillReceiveProps(nextProps) {
    this.currentAccount = _.find(nextProps.accounts, { _id: nextProps.currentAccountId });
  }
  renderFilterContainer() {
    if (this.currentAccount && !this.currentAccount.gettingMailboxes && this.currentAccount.connectionValid) {
      return <FilterContainer currentAccount={this.currentAccount} />;
    }
  }
  renderFilteredAccountEmailsContainer() {
    if (this.currentAccount && !this.currentAccount.gettingMailboxes && this.currentAccount.connectionValid) {
      return <FilteredAccountEmailsContainer compilation={this.compilation} />;
    }
  }
  render() {
    return (
      <div className="edit-account-container container">
        <h1>Add Emails to Compilation</h1>
        <SelectAccountContainer />
        {this.renderFilterContainer()}
        {this.renderFilteredAccountEmailsContainer()}
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accounts: store.accounts,
    compilationEmails: store.compilationEmails,
    currentAccountId: store.currentAccountId,
  };
}

AddCompilationEmailsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

AddCompilationEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array,
  currentAccountId: PropTypes.string,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(AddCompilationEmailsContainer);
