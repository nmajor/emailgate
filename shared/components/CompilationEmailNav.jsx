import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class CompilationEmailNav extends Component {
  constructor(props, context) {
    super(props, context);
    this.removeEmail = this.removeEmail.bind(this);
  }
  removeEmail(e) {
    e.preventDefault();

    this.props.removeEmail();
  }
  renderViewNav() {
    const path = `/compilations/${this.props.email._compilation}/emails/${this.props.email._id}`;
    return this.renderNavItem(path, 'view', 'View');
  }
  renderEditNav() {
    const path = `/compilations/${this.props.email._compilation}/emails/${this.props.email._id}/edit`;
    return this.renderNavItem(path, 'edit', 'Edit');
  }
  renderPreviewNav() {
    const path = `/compilations/${this.props.email._compilation}/emails/${this.props.email._id}/preview`;
    return this.renderNavItem(path, 'preview', 'Preview');
  }
  renderNavItem(path, page, pageName) {
    return (
      <li role="presentation" className={this.props.currentPage === page ? 'active' : ''}>
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
      <div className="accounts-list-container">
        <ul className="nav nav-pills">
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
  currentPage: PropTypes.string.isRequired,
  removeEmail: PropTypes.func.isRequired,
};

export default CompilationEmailNav;
//
//
// import React, { PropTypes, Component } from 'react';
//
// class CompilationEmailNav extends Component {
//   constructor(props, context) {
//     super(props, context);
//   }
//   renderEditAction() {
//     return <div className="btn btn-warning" onClick={this.setEditing}>edit</div>;
//   }
//   renderCancelAction() {
//     return <div className="btn btn-warning" onClick={this.unsetEditing}>cancel</div>;
//   }
//   renderRemoveAction() {
//     return <div className="btn btn-danger left-bumper" onClick={this.removeEmail}>Remove from compilation</div>;
//   }
//   renderActions() {
//     if (this.props.editing) {
//       return (<div>
//         {this.renderCancelAction()}
//         {this.renderRemoveAction()}
//       </div>);
//     }
//
//     return this.renderEditAction();
//   }
//   render() {
//     return (<div className="compilation-email-preview-actions">
//       {this.renderActions()}
//     </div>);
//   }
// }
//
// CompilationEmailNav.propTypes = {
//   email: PropTypes.object.isRequired,
// };
//
// export default CompilationEmailNav;
