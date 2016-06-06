import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import ComponentPdfContainer from './ComponentPdfContainer';

class PreviewCompilationPageContainer extends Component {
  renderPreview() {
    return (<div>
      <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
      <ComponentPdfContainer component={this.props.currentPage} />
    </div>);
  }

  render() {
    return <div>{this.renderPreview()}</div>;
  }
}

function mapStateToProps(store) {
  return {
    queueJobMap: store.queueJobMap,
  };
}

PreviewCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(PreviewCompilationPageContainer);
