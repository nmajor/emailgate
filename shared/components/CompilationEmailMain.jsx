import React, { PropTypes, Component } from 'react';

class CompilationEmailMain extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.email.subject}</h3>
        <p>{this.props.email.text}</p>
      </div>
    );
  }
}

CompilationEmailMain.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailMain;
