import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component { // eslint-disable-line
  renderCompilationLink() {
    return `/compilations/${this.props.compilation._id}/next`;
  }
  renderEmailsCount() {
    if (this.props.compilation.emailsCount > 0) {
      return (<span className="label label-default right-bumper">
        <span className="glyphicon glyphicon-envelope right-bumper" aria-hidden="true"></span>
        {this.props.compilation.emailsCount}
      </span>);
    }
  }
  renderButton() {
    return (<Link className="btn btn-success btn-xs" to={this.renderCompilationLink()}>
      <span className="glyphicon glyphicon-eye-open right-bumper" aria-hidden="true"></span>
      View
    </Link>);
  }
  render() {
    return (<div className="compilations-list-item">
      <h3>{this.props.compilation.title}</h3>
      <div className="actions">
        {this.renderEmailsCount()}
        {this.renderButton()}
      </div>
    </div>);
  }
}

CompilationsListItem.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationsListItem;
