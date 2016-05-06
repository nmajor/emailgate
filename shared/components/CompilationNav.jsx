import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Loading from './Loading';

class CompilationNav extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmailCount() {
    if (this.props.fetching.compilationEmails) {
      return <span className="button-loading"><Loading /></span>;
    }

    return `(${this.props.emailCount})`;
  }
  renderBuildNav() {
    return this.renderNavItem('build', 'Build');
  }
  renderPreviewNav() {
    return this.renderNavItem('preview', 'Preview');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderNavItem(path, pathName, badge) {
    return (
      <li role="presentation" className={this.props.currentPath === path ? 'active' : ''}>
        <Link to={`/compilations/${this.props.compilationId}/${path}`}>{pathName} {badge}</Link>
      </li>
    );
  }

  render() {
    return (
      <div className="compilation-nav container">
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-pills">
              {this.renderBuildNav()}
              {this.renderPreviewNav()}
              {this.renderCheckoutNav()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

CompilationNav.propTypes = {
  compilationId: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  emailCount: PropTypes.number.isRequired,
  fetching: PropTypes.object.isRequired,
};

export default CompilationNav;
