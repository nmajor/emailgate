import React, { PropTypes, Component } from 'react';
import Pdf from './Pdf';

class CompilationEmailPdf extends Component {
  renderPdf() {
    if (this.props.email.pdf && this.props.email.pdf.url) {
      return <Pdf file={this.props.email.pdf.url} pages={this.props.email.pdf.pageCount} />;
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
