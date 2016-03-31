import React, { PropTypes, Component } from 'react';

class CompilationPagePdf extends Component {
  renderPdf() {
    if (this.props.page.fetchingPdf) {
      return <div>Loading ...</div>;
    } else if (this.props.page.pdf) {
      return <object className="pdf" data={`${this.props.page.pdf}#messages=0&statusbar=0&toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf"></object>;
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
