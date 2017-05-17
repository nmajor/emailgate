import React, { PropTypes, Component } from 'react';
import FilteredEmailsListItem from './FilteredEmailsListItem';

class FilteredEmailsList extends Component {
  renderEmails() {
    return this.props.emails.map((email, index) => {
      const isCurrent = email.id ? (email.id === this.props.currentFilteredEmail.id) : false;
      const selected = this.props.selectedIds.indexOf(email.id) > -1;
      return (<FilteredEmailsListItem
        key={`${email.mid}-${index}`}
        email={isCurrent ? this.props.currentFilteredEmail : email}
        disabled={this.props.compilationEmailMids.indexOf(email.mid) > -1}
        selected={selected}
        previewing={isCurrent}
        selectEmail={this.props.selectEmail}
        addEmail={this.props.addEmail}
        deselectEmail={this.props.deselectEmail}
        setCurrentFilteredEmail={this.props.setCurrentFilteredEmail}
      />);
    });
  }
  render() {
    return (
      <div className="filtered-emails-list emails-list">
        {this.renderEmails()}
      </div>
    );
  }
}

FilteredEmailsList.propTypes = {
  emails: PropTypes.array.isRequired,
  compilationEmailMids: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  currentFilteredEmail: PropTypes.object,
  addEmail: PropTypes.func.isRequired,
  selectEmail: PropTypes.func.isRequired,
  deselectEmail: PropTypes.func.isRequired,
  setCurrentFilteredEmail: PropTypes.func.isRequired,
};

export default FilteredEmailsList;
