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
    } else if (this.props.emailCount > 0) {
      return `(${this.props.emailCount})`;
    }

    return '';
  }
  renderAddEmailsNav() {
    return this.renderNavItem('add-emails', `Add Emails ${this.renderEmailCount()}`);
  }
  renderBuildNav() {
    // Fine Tune
    // Build
    // Modify
    // Tweak
    // Adjust
    // Customize
    return this.renderNavItem('build', 'Customize', (this.props.emailCount === 0));
  }
  renderPreviewNav() {
    return this.renderNavItem('preview', 'Preview');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderNavItem(path, pathName) {
    if (this.props.actionStatusMap[path]) {
      return (<li role="presentation" className={this.props.currentPath === path ? 'active' : ''}>
        <Link to={`/compilations/${this.props.compilationId}/${path}`}>{pathName}</Link>
      </li>);
    }

    return (<li role="presentation" className="disabled">
      <a>{pathName}</a>
    </li>);
  }

  render() {
    return (
      <div className="compilation-nav container">
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-pills">
              {this.renderAddEmailsNav()}
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
  actionStatusMap: PropTypes.object.isRequired,
};

export default CompilationNav;
