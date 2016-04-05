import React, { PropTypes, Component } from 'react';
import CompilationEmailsListItem from './CompilationEmailsListItem';
import * as sharedHelpers from '../helpers';

class CompilationEmailsList extends Component {
  constructor(props, context) {
    super(props, context);
    this.sortedEmails = this.sortedEmails.bind(this);
  }
  sortedEmails() {
    return sharedHelpers.sortedEmails(this.props.emails);
  }
  renderEmails() {
    return this.sortedEmails().map((email) => {
      return (<CompilationEmailsListItem
        key={`${email._id}`}
        selected={email._id === this.props.currentEmailId}
        email={email}
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

CompilationEmailsList.propTypes = {
  emails: PropTypes.array.isRequired,
  currentEmailId: PropTypes.string,
};

export default CompilationEmailsList;
