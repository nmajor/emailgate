import React, { PropTypes, Component } from 'react';

class CompilationHeader extends Component { // eslint-disable-line
  render() {
    return (<div className="container centerize bottom-bumper">
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
    </div>);
  }
}

CompilationHeader.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationHeader;
