import React, { PropTypes, Component } from 'react';

class CompilationView extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h1>{this.props.compilation.title}</h1>
      <h3>{this.props.compilation.subtitle}</h3>
      <button className="btn btn-success" onClick={this.props.buildPdf}>Build PDF</button>
    </div>);
  }
}

CompilationView.propTypes = {
  compilation: PropTypes.object.isRequired,
  buildPdf: PropTypes.func.isRequired,
};

export default CompilationView;
