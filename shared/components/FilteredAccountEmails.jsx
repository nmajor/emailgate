import React, { PropTypes, Component } from 'react';

class FilteredAccountEmails extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmails() {
    return this.props.emails.map((email) => {
      return (
        <div key={email.seqno}>
          <h5>{email.subject}</h5>
          <div>{email.text}</div>
        </div>
      );
    });
  }
  render() {
    return (
      <div className="filtered-account-emails">
        <h3>Filtered Account Emails {this.props.emails.length}</h3>
        {this.renderEmails()}
      </div>
    );
  }
}

FilteredAccountEmails.propTypes = {
  emails: PropTypes.array.isRequired,
};

export default FilteredAccountEmails;
