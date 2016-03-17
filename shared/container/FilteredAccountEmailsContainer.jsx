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

    // this.addEmailToCompilation = this.addEmailToCompilation.bind(this);
    this.addEmailToSelected = this.addEmailToSelected.bind(this);
    this.removeEmailFromSelected = this.removeEmailFromSelected.bind(this);
    this.setPreviewEmail = this.setPreviewEmail.bind(this);

    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.addSelectedToCompilation = this.addSelectedToCompilation.bind(this);

    if (this.props.previewEmailMid) {
      this.previewEmail = _.find(this.props.emails, { mid: this.props.previewEmailMid }) || {};
    } else { this.previewEmail = {}; }

    this.selectedEmailMids = _.map(this.props.selectedEmails, (email) => { return email.mid; });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewEmailMid !== this.props.previewEmailMid) {
      this.previewEmail = _.find(nextProps.emails, { mid: nextProps.previewEmailMid }) || {};
    }

    if (nextProps.selectedEmails !== this.props.selectedEmails) {
      this.selectedEmailMids = _.map(nextProps.selectedEmails, (email) => { return email.mid; });
    }
  }
  setPreviewEmail(email) {
    this.props.dispatch(Actions.setPreviewEmailMid(email.mid));
  }
  addEmailToSelected(email) {
    this.props.dispatch(Actions.addEmailToSelectedEmails(email));
  }
  removeEmailFromSelected(email) {
    this.props.dispatch(Actions.removeEmailFromSelectedEmails(email));
  }
  // addEmailToCompilation(email) {
  //   console.log('addEmailToCompilation');
  //   console.log(email);
  // }
  selectAll() {
    this.props.dispatch(Actions.setSelectedEmails(this.props.emails));
  }
  deselectAll() {
    this.props.dispatch(Actions.setSelectedEmails([]));
  }
  addSelectedToCompilation() {
    console.log('addSelectedToCompilation clicked');
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
            />
            <EmailsList
              emails={this.props.emails}
              selectedEmailMids={this.selectedEmailMids}
              previewEmailMid={this.props.previewEmailMid}
              removeEmailFromSelected={this.removeEmailFromSelected}
              addEmailToSelected={this.addEmailToSelected}
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
    selectedEmails: store.selectedEmails,
    previewEmailMid: store.previewEmailMid,
  };
}

FilteredAccountEmailsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  emails: PropTypes.array.isRequired,
  selectedEmails: PropTypes.array.isRequired,
  previewEmailMid: PropTypes.string,
};

export default connect(mapStateToProps)(FilteredAccountEmailsContainer);
