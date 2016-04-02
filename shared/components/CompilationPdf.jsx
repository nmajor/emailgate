import React, { PropTypes, Component } from 'react';

class CompilationPdf extends Component {
  renderPdf() {
    if (this.props.compilation.fetchingPdf) {
      return <div>Loading ...</div>;
    } else if (this.props.compilation.pdf) {
      return <object className="pdf" data={`${this.props.compilation.pdf}#messages=0&statusbar=0&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
    }
  }
  render() {
    return (
      <div>
        {this.renderPdf()}
      </div>
    );
  }
}

CompilationPdf.propTypes = {
  compilation: PropTypes.object.isRequired,
};

export default CompilationPdf;
