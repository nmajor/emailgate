import React, { PropTypes, Component } from 'react';

class CompilationEmailPreview extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
    this.setEditing = this.setEditing.bind(this);
  }
  setEditing() {
    this.props.setEditing(true);
  }
  removeEmail() {
    this.props.removeEmail(this.props.email);
  }
  renderEditAction() {
    if (!this.props.editing) {
      return <div className="btn btn-warning" onClick={this.setEditing}>edit</div>;
    }
  }
  renderActions() {
    if (this.props.email.text) {
      return (
        <div className="actions">
          {this.renderEditAction()}
          <div className="btn btn-danger left-bumper" onClick={this.removeEmail}>Remove from compilation</div>
          {this.props.editing ? 'editing' : 'not editing'}
        </div>
      );
    }
  }
  render() {
    return (
      <div className="compilations-list-item">
        {this.renderActions()}
        <h3>{this.props.email.subject}</h3>
        <p>{this.props.email.text}</p>
      </div>
    );
  }
}

CompilationEmailPreview.propTypes = {
  email: PropTypes.object.isRequired,
  removeEmail: PropTypes.func.isRequired,
  setEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default CompilationEmailPreview;
