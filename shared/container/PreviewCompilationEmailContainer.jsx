import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import ComponentPdfContainer from './ComponentPdfContainer';
import { connect } from 'react-redux';

class PreviewCompilationEmailContainer extends Component {
  renderPreview() {
    return (<div className="compilation-email-preview">
      <h3>{this.props.currentEmail.subject}</h3>
      <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} active="preview" />
      <div className="tab-content">
        <ComponentPdfContainer component={this.props.currentEmail} />
      </div>
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

PreviewCompilationEmailContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentEmail: PropTypes.object.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(PreviewCompilationEmailContainer);
