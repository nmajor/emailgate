import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ImapFilterFormContainer from './ImapFilterFormContainer';
import GoogleFilterFormContainer from './GoogleFilterFormContainer';
import * as Actions from '../redux/actions/index';

class FilterContainer extends Component {
  componentWillUnmount() {
    this.props.dispatch(Actions.setFilteredAccountEmails([]));
    this.props.dispatch(Actions.setCurrentFilteredEmailMid(''));
    this.props.dispatch(Actions.setFilteredAccountEmailsCount(undefined));
    this.props.dispatch(Actions.setFilteredAccountEmailsErrors(undefined));
  }
  renderFilterForm() {
    if (this.props.currentAccount.kind === 'imap') {
      return <ImapFilterFormContainer currentAccount={this.props.currentAccount} />;
    } else if (this.props.currentAccount.kind === 'google') {
      return <GoogleFilterFormContainer currentAccount={this.props.currentAccount} />;
    }
  }
  render() {
    return (
      <div className="filter-container">
        {this.renderFilterForm()}
      </div>
    );
  }
}

FilterContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentAccount: PropTypes.object.isRequired,
};

export default connect()(FilterContainer);
