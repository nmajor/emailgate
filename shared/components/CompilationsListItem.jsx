import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationsListItem extends Component { // eslint-disable-line
  renderCompilationLink() {
    if (this.props.compilation.emailsCount === 0) {
      return `/compilations/${this.props.compilation._id}/add-emails`;
    }

    return `/compilations/${this.props.compilation._id}/build`;
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
    return (<Link className="btn btn-success" to={this.renderCompilationLink()}>
      <span className="glyphicon glyphicon-eye-open right-bumper" aria-hidden="true"></span>
      View
    </Link>);
  }
  render() {
    return (<div className="compilations-list-item">
      <h3>{this.props.compilation.name}</h3>
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
