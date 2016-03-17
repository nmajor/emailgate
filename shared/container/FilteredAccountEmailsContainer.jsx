import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import EmailsList from '../components/EmailsList';
import EmailPreview from '../components/EmailPreview';
import _ from 'lodash';

class FilteredAccountEmailsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    // this.addEmailToCompilation = this.addEmailToCompilation.bind(this);
    this.addEmailToSelected = this.addEmailToSelected.bind(this);
    this.removeEmailFromSelected = this.removeEmailFromSelected.bind(this);
    this.setPreviewEmail = this.setPreviewEmail.bind(this);

    if (this.props.previewEmailMid) {
      this.previewEmail = _.find(this.props.emails, { mid: this.props.previewEmailMid }) || {};
    } else { this.previewEmail = {}; }

    this.selectedEmailMids = _.map(this.props.selectedEmails, (email) => { return email.mid; });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.previewEmailMid !== this.props.previewEmailMid) {
      this.previewEmail = _.find(nextProps.emails, { mid: nextProps.previewEmailMid }) || {};
      console.log(this.previewEmail);
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
  render() {
    return (
      <div className="filter-container row">
        <h3>Filtered Account Emails {this.props.emails.length}</h3>
        <div className="col-md-3">
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
