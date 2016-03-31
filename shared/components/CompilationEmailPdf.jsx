import React, { PropTypes, Component } from 'react';

class CompilationEmailPdf extends Component {
  renderPdf() {
    if (this.props.email.fetchingPdf) {
      return <div>Loading ...</div>;
    } else if (this.props.email.pdf) {
      return <object className="pdf" data={`${this.props.email.pdf}#messages=0&statusbar=0&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
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

CompilationEmailPdf.propTypes = {
  email: PropTypes.object.isRequired,
};

export default CompilationEmailPdf;
