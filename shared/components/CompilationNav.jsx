import React, { PropTypes, Component } from 'react';

class CompilationNav extends Component {
  constructor(props, context) {
    super(props, context);
  }
  renderAddEmailsNav() {
    return this.renderNavItem('add-emails', 'Add Emails');
  }
  renderEditEmailsNav() {
    return this.renderNavItem('edit-emails', 'Edit Emails');
  }
  renderOptionsNav() {
    return this.renderNavItem('options', 'Options');
  }
  renderPreviewNav() {
    return this.renderNavItem('preview', 'Preview');
  }
  renderCheckoutNav() {
    return this.renderNavItem('checkout', 'Checkout');
  }
  renderNavItem(page, pageName) {
    return (
      <li role="presentation" className={this.props.currentPage === page ? 'active' : ''}>
        <a href={`/compilations/${this.props.compilationId}/${page}`}>{pageName}</a>
      </li>
    );
  }

  render() {
    return (
      <div className="accounts-list-container">
        <div className="container">
          <ul className="nav nav-pills">
            {this.renderAddEmailsNav()}
            {this.renderEditEmailsNav()}
            {this.renderOptionsNav()}
            {this.renderPreviewNav()}
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
