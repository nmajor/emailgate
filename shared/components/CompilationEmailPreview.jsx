import React, { PropTypes, Component } from 'react';

class CompilationEmailPreview extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.email.subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.email.body }} />
      </div>
    );
  }
}

CompilationEmailPreview.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailPreview;
