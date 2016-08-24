import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationEmailNav extends Component {
  constructor(props, context) {
    super(props, context);
    this.removeEmail = this.removeEmail.bind(this);
  }
  removeEmail(e) {
    e.preventDefault();

    if (window.confirm('Are you sure you want to remove this email?')) { // eslint-disable-line no-alert
      this.props.removeEmail();
    }
  }
  renderViewNav() {
    const path = `/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}`;
    return this.renderNavItem(path, 'view', 'View');
  }
  renderEditNav() {
    const path = `/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}/edit`;
    return this.renderNavItem(path, 'edit', 'Edit');
  }
  renderPreviewNav() {
    const path = `/compilations/${this.props.email._compilation}/build/emails/${this.props.email._id}/preview`;
    return this.renderNavItem(path, 'preview', 'PDF Preview');
  }
  renderNavItem(path, active, pageName) {
    return (
      <li role="presentation" className={this.props.active === active ? 'active' : ''}>
        <Link to={path}>{pageName}</Link>
      </li>
    );
  }
  renderRemoveAction() {
    return (
      <li role="presentation">
        <a className="action text-danger" onClick={this.removeEmail}>Remove</a>
      </li>
    );
  }

  render() {
    return (
      <div className="compilation-email-nav">
        <ul className="nav nav-tabs">
          {this.renderViewNav()}
          {this.renderEditNav()}
          {this.renderPreviewNav()}
          {this.renderRemoveAction()}
        </ul>
      </div>
    );
  }
}

CompilationEmailNav.propTypes = {
  email: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
  removeEmail: PropTypes.func.isRequired,
};

export default CompilationEmailNav;
