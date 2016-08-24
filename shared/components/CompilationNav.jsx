import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
// import Loading from './Loading';

class CompilationNav extends Component {
  renderEmailCount() {
    if (this.props.emailCount > 0 && !this.props.fetching.compilationEmails) {
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
    return this.renderNavItem('preview', 'PDF Preview');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderItemLink(className, path, pathName) {
    return (<li role="presentation" className={className}>
      <Link to={`/compilations/${this.props.compilationId}/${path}`}>{pathName}</Link>
    </li>);
  }
  renderNavItem(path, pathName) {
    if (this.props.currentPath === path) {
      return this.renderItemLink('active', path, pathName);
    } else if (this.props.actionStatusMap[path] === 'loud') {
      return this.renderItemLink('loud-nav', path, pathName);
    } else if (this.props.actionStatusMap[path] === 'disabled') {
      return (<li role="presentation" className="disabled">
        <a>{pathName}</a>
      </li>);
    }

    return this.renderItemLink('', path, pathName);
  }

  render() {
    return (<div className="compilation-nav">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-tabs">
              {this.renderAddEmailsNav()}
              {this.renderBuildNav()}
              {this.renderPreviewNav()}
              {this.renderCheckoutNav()}
            </ul>
          </div>
        </div>
      </div>
    </div>);
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
