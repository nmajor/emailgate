import React, { PropTypes, Component } from 'react';
import FilteredEmailsListItem from './FilteredEmailsListItem';

class FilteredEmailsList extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmails() {
    return this.props.emails.map((email, index) => {
      return (<FilteredEmailsListItem
        key={`${email.mid}-${index}`}
        email={email}
        disabled={this.props.compilationEmailMids.indexOf(email.mid) > -1}
        selected={email.selected}
        saving={email.saving}
        previewing={email.mid === this.props.previewEmailMid}
        selectEmail={this.props.selectEmail}
        deselectEmail={this.props.deselectEmail}
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

FilteredEmailsList.propTypes = {
  emails: PropTypes.array.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  previewEmailMid: PropTypes.string,
  selectEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setPreviewEmail: PropTypes.func.isRequired,
};

export default FilteredEmailsList;
