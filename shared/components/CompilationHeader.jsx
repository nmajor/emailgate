import React, { PropTypes, Component } from 'react';

class CompilationHeader extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className="container centerize bottom-bumper">
        <h1>{this.props.compilation.name}</h1>
      </div>
    );
  }
}

CompilationHeader.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationHeader;
