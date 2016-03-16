import React, { PropTypes, Component } from 'react';

class FilteredAccountEmailsCount extends Component {
  render() {
    return (
      <div className="filtered-account-emails-count">
        <h3>{this.props.filteredAccountEmailsCount} Emails</h3>
        <button className="btn btn-success" onClick={this.handleClick}>Get Emails</button>
      </div>
    );
  }
}

FilteredAccountEmailsCount.propTypes = {
  filteredAccountEmailsCount: PropTypes.number,
};

export default FilteredAccountEmailsCount;
