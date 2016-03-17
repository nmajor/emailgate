import React, { PropTypes, Component } from 'react';
import EmailsListItem from './EmailsListItem';

class EmailsList extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmails() {
    return this.props.emails.map((email, index) => {
      return (<EmailsListItem
        key={`${email.mid}-${index}`}
        email={email}
        selected={this.props.selectedEmailMids.indexOf(email.mid) > -1}
        previewing={email.mid === this.props.previewEmailMid}
        addEmailToSelected={this.props.addEmailToSelected}
        removeEmailFromSelected={this.props.removeEmailFromSelected}
        setPreviewEmail={this.props.setPreviewEmail}
      />);
    });
  }
  render() {
    return (
      <div className="emails-list">
        {this.renderEmails()}
      </div>
    );
  }
}

EmailsList.propTypes = {
  emails: PropTypes.array.isRequired,
  selectedEmailMids: PropTypes.array.isRequired,
  previewEmailMid: PropTypes.string,
  addEmailToSelected: PropTypes.func.isRequired,
  removeEmailFromSelected: PropTypes.func.isRequired,
  setPreviewEmail: PropTypes.func.isRequired,
};

export default EmailsList;
