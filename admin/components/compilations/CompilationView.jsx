import React, { PropTypes, Component } from 'react';

class CompilationView extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
    </div>);
  }
}

CompilationView.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationView;
