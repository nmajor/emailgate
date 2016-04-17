import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ImapFilterFormContainer from './ImapFilterFormContainer';
import GoogleFilterFormContainer from './GoogleFilterFormContainer';

class FilterContainer extends Component {
  constructor(props, context) {
    super(props, context);
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
        <h3>Filter</h3>
        {this.renderFilterForm()}
      </div>
    );
  }
}

FilterContainer.propTypes = {
  currentAccount: PropTypes.object.isRequired,
};

export default connect()(FilterContainer);
