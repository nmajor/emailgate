import React, { PropTypes, Component } from 'react';
import FilteredEmailsListItem from './FilteredEmailsListItem';

class FilteredEmailsList extends Component {
  renderEmails() {
    return this.props.emails.map((email, index) => {
      return (<FilteredEmailsListItem
        key={`${email.mid}-${index}`}
        email={email}
        disabled={this.props.compilationEmailMids.indexOf(email.mid) > -1}
        selected={email.selected}
        saving={email.saving}
        previewing={email.mid === this.props.currentFilteredEmailMid}
        selectEmail={this.props.selectEmail}
        deselectEmail={this.props.deselectEmail}
        setCurrentFilteredEmail={this.props.setCurrentFilteredEmail}
      />);
    });
  }
  render() {
    return (
      <div className="component-list emails-list">
        {this.renderEmails()}
      </div>
    );
  }
}

FilteredEmailsList.propTypes = {
  emails: PropTypes.array.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  currentFilteredEmailMid: PropTypes.string,
  selectEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setCurrentFilteredEmail: PropTypes.func.isRequired,
};

export default FilteredEmailsList;
