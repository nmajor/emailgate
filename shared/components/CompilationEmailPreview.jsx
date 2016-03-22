import React, { PropTypes, Component } from 'react';

class CompilationEmailPreview extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.email.subject}</h3>
        <p>{this.props.email.text}</p>
      </div>
    );
  }
}

CompilationEmailPreview.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailPreview;
