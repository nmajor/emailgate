import React, { PropTypes, Component } from 'react';

class EmailsListActions extends Component {
  render() {
    return (
      <div className="emails-list-actions">
        <div className="btn btn-default select-all" onClick={this.props.selectAll}>
          <span className="glyphicon glyphicon-check" aria-hidden="true"></span> All
        </div>
        <div className="btn btn-default deselect-all" onClick={this.props.deselectAll}>
          <span className="glyphicon glyphicon-unchecked" aria-hidden="true"></span> All
        </div>
        <div className="btn btn-success add-selected" onClick={this.props.addSelectedToCompilation}>Add Emails to Compilation</div>
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
