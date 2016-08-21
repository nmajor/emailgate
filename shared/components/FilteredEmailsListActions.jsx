import React, { PropTypes, Component } from 'react';
import Loading from './Loading';
// import { Link } from 'react-router';

class FilteredEmailsListActions extends Component {
  constructor(props, context) {
    super(props, context);

    this.addSelected = this.addSelected.bind(this);
  }
  addSelected() {
    if (this.props.canAdd) {
      this.props.addSelectedToCompilation();
    }
  }
  renderLoading() {
    if (this.props.saving) {
      return <span className="button-loading"><Loading /></span>;
    }
  }
  renderAddSelectedAction() {
    return (<div className={`btn btn-success btn-block add-selected ${this.props.canAdd ? '' : 'disabled'}`} onClick={this.addSelected}>
      Add <span className="glyphicon glyphicon-check" aria-hidden="true"></span> Emails ({this.props.selectedEmailsCount})
      {this.renderLoading()}
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
  selectedEmailsCount: PropTypes.number.isRequired,
  compilationEmailsCount: PropTypes.number.isRequired,
  compilationId: PropTypes.string.isRequired,
  saving: PropTypes.bool,
};

export default FilteredEmailsListActions;
