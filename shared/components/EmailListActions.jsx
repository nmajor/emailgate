import React, { PropTypes, Component } from 'react';

class EmailsListActions extends Component {
  render() {
    return (
      <div className="emails-list-actions">
        actions
      </div>
    );
  }
}

EmailsListActions.propTypes = {
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  addSelectedToCompilation: PropTypes.func.isRequired,
};

export default EmailsListActions;
