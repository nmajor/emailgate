import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import { connect } from 'react-redux';

class PdfCompilationEmailContainer extends Component {
  renderPdf() {
    if (this.props.currentEmail) {
      return (
        <div>
          <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} currentPage="preview" />
          PDF Preview here
        </div>
      );
    }
  }

  render() {
    return <div>{this.renderPdf()}</div>;
  }
}

PdfCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect()(PdfCompilationEmailContainer);
