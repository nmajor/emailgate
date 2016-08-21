import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import FilteredEmailsListContainer from './FilteredEmailsListContainer';
import FilteredEmailMainContainer from './FilteredEmailMainContainer';
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
  renderProgress() {
    const count = this.props.filteredAccountEmailsResults.count || 0;
    const errors = this.props.filteredAccountEmailsResults.errors;

    if (this.props.filteredAccountEmails.length !== count && !errors) {
      return <span>{this.props.filteredAccountEmails.length}/{count}</span>;
    }
  }
  render() {
    return (
      <div className="filtered-account-emails-container">
        <h3>Emails {this.renderProgress()}</h3>
        <div className="row">
          <div className="col-sm-3 col-md-3">
            <FilteredEmailsListContainer
              compilation={this.props.compilation}
              compilationEmailMids={this.compilationEmailMids}
              currentFilteredEmail={this.currentFilteredEmail}
            />
          </div>
          <div className="col-sm-9 col-md-9">
            <FilteredEmailMainContainer
              compilation={this.props.compilation}
              compilationEmailMids={this.compilationEmailMids}
              currentFilteredEmail={this.currentFilteredEmail}
            />
          </div>
        </div>
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
