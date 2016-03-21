import React, { PropTypes, Component } from 'react';

class CompilationEmailPreview extends Component {
  constructor(props, context) {
    super(props, context);

    this.removeEmail = this.removeEmail.bind(this);
  }
  removeEmail() {
    this.props.removeEmailFromCompilation(this.props.email);
  }
  renderActions() {
    if (this.props.email.text) {
      return <div className="btn btn-danger" onClick={this.removeEmail}>Remove from compilation</div>;
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
  removeEmailFromCompilation: PropTypes.func.isRequired,
};

export default CompilationEmailPreview;
