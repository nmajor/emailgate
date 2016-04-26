import React, { PropTypes, Component } from 'react';
// import CompilationPdf from '../components/CompilationPdf';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.buildCompilationPdf = this.buildCompilationPdf.bind(this);
  }
  buildCompilationPdf() {
    this.props.dispatch(Actions.buildCompilationPdf(this.props.params.compilationId));
  }

  renderCompilationPdfLog() {
    const entries = this.props.compilationPdfLog.map((entry, index) => {
      if (index === 0) {
        return <div key={index}><strong>{entry.message}</strong></div>;
      }
      return <div key={index}>{entry.message}</div>;
    });

    return <div>{entries}</div>;
  }
  renderCompilationPdf() {
    // return <CompilationPdf compilation={this.props.compilation} />
  }
  renderCompilationPdfStatus() {
    if (this.props.compilation.buildingPdf) {
      return <span className="left-bumper">Building compilation pdf ...</span>;
    }
  }
  renderBuildCompilationButton() {
    return <div className="btn btn-default" onClick={this.buildCompilationPdf}>Generate PDF</div>;
  }
  render() {
    return (
      <div>
        <h1>Compilation Preview</h1>
        <div className="row">
          <div className="col-md-4">
            {this.renderBuildCompilationButton()}
            {this.renderCompilationPdfStatus()}
            {this.renderCompilationPdfLog()}
          </div>
          <div className="col-md-8">
            {this.renderCompilationPdf()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    compilationPdfLog: store.compilationPdfLog,
  };
}

CompilationPreviewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationPdfLog: PropTypes.array.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPreviewContainer);
