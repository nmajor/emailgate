import React, { PropTypes, Component } from 'react';
import Pdf from './Pdf';

class CompilationPagePdf extends Component {
  renderPdf() {
    if (this.props.page.pdf && this.props.page.pdf.url) {
      return <Pdf file={this.props.page.pdf.url} pages={this.props.page.pdf.pageCount} />;
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

CompilationPagePdf.propTypes = {
  page: PropTypes.object.isRequired,
};

export default CompilationPagePdf;
