import React, { PropTypes, Component } from 'react';
import Pdf from './Pdf';

class CompilationEmailPdf extends Component {
  renderPdf() {
    if (this.props.email.pdf && this.props.email.pdf.url) {
      return <Pdf file={this.props.email.pdf.url} pages={this.props.email.pdf.pageCount} />;
    }

    return null;
    // if (this.props.email.pdf && this.props.email.pdf.url) {
    //  return <object className="pdf" data={`${this.props.email.pdf.url}#messages=0&statusbar=0&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
    // }
    // return <div>No pdf available for this page.</div>;
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
