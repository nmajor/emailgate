import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import ComponentPdfContainer from './ComponentPdfContainer';
import { pageMeta } from '../helpers';

class PreviewCompilationPageContainer extends Component { // eslint-disable-line
  render() {
    return (<div>
      <h3>{pageMeta(this.props.currentPage).desc}</h3>
      <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
      <div className="tab-content">
        <ComponentPdfContainer component={this.props.currentPage} />
      </div>
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
