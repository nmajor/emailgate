import React, { PropTypes, Component } from 'react';
// import CompilationPdf from '../components/CompilationPdf';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import moment from 'moment';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.buildCompilationPdf = this.buildCompilationPdf.bind(this);
  }
  buildCompilationPdf() {
    this.props.dispatch(Actions.buildCompilationPdf(this.props.params.compilationId));
  }
  renderError(entry) {
    if (entry.type === 'error') {
      try {
        return <span className="text-danger"> - {JSON.stringify(entry.payload)}</span>;
      } catch (e) {
        return <span className="text-danger"> - {entry.payload}</span>;
      }
    }
  }

  renderCompilationPdfLog() {
    const entries = this.props.compilationPdfLog.map((entry, index) => {
      return (<div className={`compilation-log-entry ${index === 0 ? 'latest' : ''}`} key={index}>
        {entry.message}
        {this.renderError(entry)}
      </div>);
    });

    return <div>{entries}</div>;
  }
  renderCompilationPdf() {
    return (<div>
      <div>PDF Last Updated: {moment(this.props.compilation.pdf.updatedAt).fromNow()}</div>
      <a target="_blank" href={this.props.compilation.pdf.url}>View Pdf</a>
    </div>);
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
