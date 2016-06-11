import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import ComponentPdfContainer from './ComponentPdfContainer';
import { pageMeta } from '../helpers';

class PreviewCompilationPageContainer extends Component {
  render() {
    return (<div>
      <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
      <h3>{pageMeta(this.props.currentPage).desc}</h3>
      <ComponentPdfContainer component={this.props.currentPage} />
    </div>);
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
