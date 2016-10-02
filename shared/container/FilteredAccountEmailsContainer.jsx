import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import FilteredEmailsListContainer from './FilteredEmailsListContainer';
import _ from 'lodash';

class FilteredAccountEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    if (this.props.currentFilteredEmailMid) {
      this.currentFilteredEmail = _.find(this.props.compilationEmails, { mid: this.props.currentFilteredEmailMid }) || {};
    } else { this.currentFilteredEmail = {}; }

    this.compilationEmailMids = _.map(this.props.compilationEmails, (email) => { return email.mid; });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentFilteredEmailMid !== this.props.currentFilteredEmailMid) {
      this.currentFilteredEmail = _.find(nextProps.filteredAccountEmails, { mid: nextProps.currentFilteredEmailMid }) || {};
    }

    if (nextProps.compilationEmails !== this.props.compilationEmails) {
      this.compilationEmailMids = _.map(nextProps.compilationEmails, (email) => { return email.mid; });
    }
  }
  render() {
    return (
      <div className="filtered-account-emails-container">
        <FilteredEmailsListContainer
          compilation={this.props.compilation}
          compilationEmailMids={this.compilationEmailMids}
          currentFilteredEmail={this.currentFilteredEmail}
        />
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    filteredAccountEmails: store.filteredAccountEmails,
    filteredAccountEmailsResults: store.filteredAccountEmailsResults,
    compilationEmails: store.compilationEmails,
    currentFilteredEmailMid: store.currentFilteredEmailMid,
  };
}

FilteredAccountEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filteredAccountEmails: PropTypes.array.isRequired,
  filteredAccountEmailsResults: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  currentFilteredEmailMid: PropTypes.string,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(FilteredAccountEmailsContainer);
