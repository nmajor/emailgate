import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { pageMeta } from '../helpers';

class CompilationPageNav extends Component {
  renderViewNav() {
    const path = `/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}`;
    return this.renderNavItem(path, 'view', 'View');
  }
  renderEditNav() {
    if (pageMeta(this.props.page).editable) {
      const path = `/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}/edit`;
      return this.renderNavItem(path, 'edit', 'Edit');
    }
  }
  renderPreviewNav() {
    const path = `/compilations/${this.props.page._compilation}/build/pages/${this.props.page._id}/preview`;
    return this.renderNavItem(path, 'preview', 'PDF Preview');
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
      <div className="compilation-page-nav">
        <ul className="nav nav-tabs">
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
