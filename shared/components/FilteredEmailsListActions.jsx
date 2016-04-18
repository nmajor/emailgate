import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';

class FilteredEmailsListActions extends Component {
  // renderCompilationEmailsAction() {
  //   return (<Link to={`/compilations/${this.props.compilationId}/emails`} className="btn btn-primary btn-block">
  //     Emails ({this.props.compilationEmailsCount})
  //   </Link>);
  // }
  renderAddSelectedAction() {
    return (<div className={`btn btn-success btn-block add-selected ${this.props.canAdd ? '' : 'disabled'}`} onClick={this.props.addSelectedToCompilation}>
      Add <span className="glyphicon glyphicon-check" aria-hidden="true"></span> to Compilation
    </div>);
  }
  renderCheckAll() {
    return (<div className="btn btn-default select-all btn-block half-left" onClick={this.props.selectAll}>
      <span className="glyphicon glyphicon-check" aria-hidden="true"></span> All
    </div>);
  }
  renderUncheckAll() {
    return (<div className="btn btn-default deselect-all btn-block half-right" onClick={this.props.deselectAll}>
      <span className="glyphicon glyphicon-unchecked" aria-hidden="true"></span> All
    </div>);
  }
  render() {
    return (
      <div className="bottom-bumper">
        {this.renderAddSelectedAction()}
        {this.renderCheckAll()}
        {this.renderUncheckAll()}
      </div>
    );
  }
}

FilteredEmailsListActions.propTypes = {
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  addSelectedToCompilation: PropTypes.func.isRequired,
  canAdd: PropTypes.bool.isRequired,
  compilationEmailsCount: PropTypes.number.isRequired,
  compilationId: PropTypes.string.isRequired,
};

export default FilteredEmailsListActions;
