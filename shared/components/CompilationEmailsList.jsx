import React, { PropTypes, Component } from 'react';
import CompilationEmailsListItem from './CompilationEmailsListItem';

class CompilationEmailsList extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmails() {
    return this.props.emails.map((email) => {
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
