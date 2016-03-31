import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationPageNav extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderViewNav() {
    const path = `/compilations/${this.props.page._compilation}/pages/${this.props.page._id}`;
    return this.renderNavItem(path, 'view', 'View');
  }
  renderEditNav() {
    const path = `/compilations/${this.props.page._compilation}/pages/${this.props.page._id}/edit`;
    return this.renderNavItem(path, 'edit', 'Edit');
  }
  renderPreviewNav() {
    const path = `/compilations/${this.props.page._compilation}/pages/${this.props.page._id}/preview`;
    return this.renderNavItem(path, 'preview', 'Preview');
  }
  renderNavItem(path, active, pageName) {
    return (
      <li role="presentation" className={this.props.active === active ? 'active' : ''}>
        <Link to={path}>{pageName}</Link>
      </li>
    );
  }

  render() {
    return (
      <div className="compilation-page-nav bottom-bumper">
        <ul className="nav nav-pills">
          {this.renderViewNav()}
          {this.renderEditNav()}
          {this.renderPreviewNav()}
        </ul>
      </div>
    );
  }
}

CompilationPageNav.propTypes = {
  page: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
};

export default CompilationPageNav;