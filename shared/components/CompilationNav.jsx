import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationNav extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmailsNav() {
    return this.renderNavItem('emails', `Emails (${this.props.emailCount})`);
  }
  renderPagesNav() {
    return this.renderNavItem('pages', 'Pages');
  }
  renderPreviewNav() {
    return this.renderNavItem('preview', 'Preview');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderNavItem(path, pathName) {
    return (
      <li role="presentation" className={this.props.currentPath === path ? 'active' : ''}>
        <Link to={`/compilations/${this.props.compilationId}/${path}`}>{pathName}</Link>
      </li>
    );
  }

  render() {
    return (
      <div className="compilation-nav container">
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-pills">
              {this.renderEmailsNav()}
              {this.renderPagesNav()}
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
};

export default CompilationNav;
