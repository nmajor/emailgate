import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import CartCompilationButtonContainer from '../container/CartCompilationButtonContainer';

class CompilationsListItem extends Component { // eslint-disable-line
  renderCompilationLink() {
    return `/compilations/${this.props.compilation._id}/pre-next`;
  }
  renderEmailsCount() {
    if (this.props.compilation.emailsCount > 0) {
      return (<span className="label label-default right-bumper">
        <span className="glyphicon glyphicon-envelope right-bumper" aria-hidden="true"></span>
        {this.props.compilation.emailsCount}
      </span>);
    }
  }
  renderViewButton() {
    return (<Link className="btn btn-default btn-xs" to={this.renderCompilationLink()}>
      <span className="glyphicon glyphicon-eye-open right-bumper" aria-hidden="true"></span>
      View
    </Link>);
  }
  renderAddButton() {
    return (<CartCompilationButtonContainer compilation={this.props.compilation} />);
  }
  render() {
    return (<div className="compilations-list-item">
      <h3>{this.props.compilation.title}</h3>
      <div className="actions">
        {this.renderEmailsCount()}
        {this.renderViewButton()}
        {this.renderAddButton()}
      </div>
    </div>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
