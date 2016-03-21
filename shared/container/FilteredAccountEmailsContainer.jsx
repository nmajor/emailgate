import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import FilteredEmailsList from '../components/FilteredEmailsList';
import FilteredEmailPreview from '../components/FilteredEmailPreview';
import FilteredEmailsListActions from '../components/FilteredEmailsListActions';
import _ from 'lodash';

class FilteredAccountEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.selectEmail = this.selectEmail.bind(this);
    this.deselectEmail = this.deselectEmail.bind(this);
    this.setPreviewEmail = this.setPreviewEmail.bind(this);

    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.addSelectedToCompilation = this.addSelectedToCompilation.bind(this);
    this.removeEmailFromCompilation = this.removeEmailFromCompilation.bind(this);

    if (this.props.previewEmailMid) {
      this.previewEmail = _.find(this.props.emails, { mid: this.props.previewEmailMid }) || {};
    } else { this.previewEmail = {}; }

    this.compilationEmailMids = _.map(this.props.compilationEmails, (email) => { return email.mid; });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewEmailMid !== this.props.previewEmailMid) {
      this.previewEmail = _.find(nextProps.emails, { mid: nextProps.previewEmailMid }) || {};
    }

    if (nextProps.compilationEmails !== this.props.compilationEmails) {
      this.compilationEmailMids = _.map(nextProps.compilationEmails, (email) => { return email.mid; });
    }
  }
  setPreviewEmail(email) {
    this.props.dispatch(Actions.setPreviewEmailMid(email.mid));
  }
  selectEmail(email) {
    this.props.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', true));
  }
  deselectEmail(email) {
    this.props.dispatch(Actions.setPropertyForFilteredAccountEmail(email, 'selected', false));
  }
  selectAll() {
    const nonCompilationEmails = _.filter(this.props.emails, (email) => {
      return !this.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', true));
  }
  deselectAll() {
    const nonCompilationEmails = _.filter(this.props.emails, (email) => {
      return !this.compilationEmailMids.indexOf(email.mid) > -1;
    });

    const emailMids = _.map(nonCompilationEmails, (email) => { return email.mid; });

    this.props.dispatch(Actions.setPropertyForSomeFilteredAccountEmails(emailMids, 'selected', false));
  }
  addSelectedToCompilation() {
    this.props.dispatch(Actions.addEmailsToCompilationEmails(this.props.compilation._id, _.filter(this.props.emails, { selected: true })));
  }
  removeEmailFromCompilation(email) {
    const compilationEmail = _.find(this.props.compilationEmails, { mid: email.mid });
    this.props.dispatch(Actions.removeEmailFromCompilationEmails(this.props.compilation._id, compilationEmail));
  }
  render() {
    return (
      <div className="filtered-account-emails-container">
        <h3>Filtered Account Emails {this.props.emails.length}</h3>
        <div className="row">
          <div className="col-md-3">
            <FilteredEmailsListActions
              selectAll={this.selectAll}
              deselectAll={this.deselectAll}
              addSelectedToCompilation={this.addSelectedToCompilation}
              canAdd={_.some(this.props.emails, { selected: true })}
            />
            <FilteredEmailsList
              emails={this.props.emails}
              compilationEmailMids={this.compilationEmailMids}
              previewEmailMid={this.props.previewEmailMid}
              deselectEmail={this.deselectEmail}
              selectEmail={this.selectEmail}
              setPreviewEmail={this.setPreviewEmail}
            />
          </div>
          <div className="col-md-9">
            <FilteredEmailPreview
              email={this.previewEmail}
              isCompilationEmail={this.compilationEmailMids.indexOf(this.previewEmail.mid) > -1}
              removeEmailFromCompilation={this.removeEmailFromCompilation}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    emails: store.filteredAccountEmails,
    compilationEmails: store.compilationEmails,
    previewEmailMid: store.previewEmailMid,
  };
}

FilteredAccountEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  emails: PropTypes.array.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  previewEmailMid: PropTypes.string,
  compilation: PropTypes.object,
};

export default connect(mapStateToProps)(FilteredAccountEmailsContainer);
