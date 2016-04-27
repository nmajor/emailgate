import React, { PropTypes, Component } from 'react';

class CompilationPagePdf extends Component {
  renderPdf() {
    if (this.props.page.pdf && this.props.page.pdf.url) {
      return <object className="pdf" data={`${this.props.page.pdf.url}#messages=0&statusbar=0&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
    }
    return <div>No pdf available for this page.</div>;
  }
  render() {
    return (
      <div>
        {this.renderPdf()}
      </div>
    );
  }
}

CompilationPagePdf.propTypes = {
  page: PropTypes.object.isRequired,
};

export default CompilationPagePdf;
