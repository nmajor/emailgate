import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationNav extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderEmailsNav() {
    return this.renderNavItem('emails', 'Emails');
  }
  renderPublishNav() {
    return this.renderNavItem('publish', 'Publish');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderNavItem(page, pageName) {
    return (
      <li role="presentation" className={this.props.currentPage === page ? 'active' : ''}>
        <Link to={`/compilations/${this.props.compilationId}/${page}`}>{pageName}</Link>
      </li>
    );
  }

  render() {
    return (
      <div className="compilation-nav">
        <div className="container">
          <ul className="nav nav-pills">
            {this.renderEmailsNav()}
            {this.renderPublishNav()}
            {this.renderCheckoutNav()}
          </ul>
        </div>
      </div>
    );
  }
}

CompilationNav.propTypes = {
  compilationId: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
};

export default CompilationNav;
