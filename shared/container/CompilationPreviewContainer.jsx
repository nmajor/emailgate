import React, { PropTypes, Component } from 'react';
import { Line } from 'rc-progress';
// import CompilationPdf from '../components/CompilationPdf';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import moment from 'moment';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.buildCompilationPdf = this.buildCompilationPdf.bind(this);
    this.pdfJob = this.props.queueJobMap[`compilation-${this.props.compilation._id}`];
  }
  componentWillReceiveProps(nextProps) {
    this.pdfJob = nextProps.queueJobMap[`compilation-${nextProps.compilation._id}`];
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

  renderCompilationPdf() {
    if (this.props.compilation.pdf) {
      return (<div>
        <div>PDF Last Updated: {moment(this.props.compilation.pdf.updatedAt).fromNow()}</div>
        <a target="_blank" href={this.props.compilation.pdf.url}>View Pdf</a>
      </div>);
    }
  }
  renderCompilationPdfProgress() {
    if (this.pdfJob) {
      return (<div>
        <div className="text-center">{this.pdfJob.progress}%</div>
        <Line percent={this.pdfJob.progress} />
      </div>);
    }
  }
  renderBuildCompilationButton() {
    return <div className="btn btn-default" onClick={this.buildCompilationPdf}>Generate PDF</div>;
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            {this.renderBuildCompilationButton()}
            {this.renderCompilationPdfProgress()}
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
    queueJobMap: store.queueJobMap,
  };
}

CompilationPreviewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPreviewContainer);
