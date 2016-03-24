import React, { PropTypes, Component } from 'react';

class CompilationEmailView extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.email.subject}</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.email.body }} />
      </div>
    );
  }
}

CompilationEmailView.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailView;
