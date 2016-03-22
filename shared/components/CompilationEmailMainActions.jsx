import React, { PropTypes, Component } from 'react';

class CompilationEmailMainActions extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
    this.setEditing = this.setEditing.bind(this);
    this.unsetEditing = this.unsetEditing.bind(this);
  }
  setEditing() {
    this.props.setEditing(true);
  }
  unsetEditing() {
    this.props.setEditing(false);
  }
  removeEmail() {
    this.props.removeEmail(this.props.email);
  }
  renderEditAction() {
    return <div className="btn btn-warning" onClick={this.setEditing}>edit</div>;
  }
  renderCancelAction() {
    return <div className="btn btn-warning" onClick={this.unsetEditing}>cancel</div>;
  }
  renderRemoveAction() {
    return <div className="btn btn-danger left-bumper" onClick={this.removeEmail}>Remove from compilation</div>;
  }
  renderActions() {
    if (this.props.editing) {
      return (<div>
        {this.renderCancelAction()}
        {this.renderRemoveAction()}
      </div>);
    }

    return this.renderEditAction();
  }
  render() {
    return (<div className="compilation-email-preview-actions">
      {this.renderActions()}
    </div>);
  }
}

CompilationEmailMainActions.propTypes = {
  email: PropTypes.object.isRequired,
  removeEmail: PropTypes.func.isRequired,
  setEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default CompilationEmailMainActions;
