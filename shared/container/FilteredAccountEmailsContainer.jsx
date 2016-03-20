import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import EmailsList from '../components/EmailsList';
import EmailPreview from '../components/EmailPreview';
import EmailsListActions from '../components/EmailsListActions';
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

    if (this.props.previewEmailMid) {
      this.previewEmail = _.find(this.props.emails, { mid: this.props.previewEmailMid }) || {};
    } else { this.previewEmail = {}; }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewEmailMid !== this.props.previewEmailMid) {
      this.previewEmail = _.find(nextProps.emails, { mid: nextProps.previewEmailMid }) || {};
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
    this.props.dispatch(Actions.setPropertyForAllFilteredAccountEmails('selected', true));
  }
  deselectAll() {
    this.props.dispatch(Actions.setPropertyForAllFilteredAccountEmails('selected', false));
  }
  addSelectedToCompilation() {
    this.props.dispatch(Actions.addEmailsToCompilation(this.props.compilationId, _.filter(this.props.emails, { selected: true })));
  }
  render() {
    return (
      <div className="filtered-account-emails-container">
        <h3>Filtered Account Emails {this.props.emails.length}</h3>
        <div className="row">
          <div className="col-md-3">
            <EmailsListActions
              selectAll={this.selectAll}
              deselectAll={this.deselectAll}
              addSelectedToCompilation={this.addSelectedToCompilation}
              canAdd={_.some(this.props.emails, { selected: true })}
            />
            <EmailsList
              emails={this.props.emails}
              previewEmailMid={this.props.previewEmailMid}
              deselectEmail={this.deselectEmail}
              selectEmail={this.selectEmail}
              setPreviewEmail={this.setPreviewEmail}
            />
          </div>
          <div className="col-md-9">
            <EmailPreview email={this.previewEmail} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    emails: store.filteredAccountEmails,
    previewEmailMid: store.previewEmailMid,
  };
}

FilteredAccountEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  emails: PropTypes.array.isRequired,
  previewEmailMid: PropTypes.string,
  compilationId: PropTypes.string,
};

export default connect(mapStateToProps)(FilteredAccountEmailsContainer);
