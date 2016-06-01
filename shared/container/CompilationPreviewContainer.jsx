import React, { PropTypes, Component } from 'react';
// import CompilationPdf from '../components/CompilationPdf';
import JobStatus from '../components/JobStatus';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';
import moment from 'moment';

class CompilationPreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.pdfJob = this.props.queueJobMap[`compilation-${this.props.compilation._id}`];
  }
  componentDidMount() {
    this.props.dispatch(Actions.getCompilationPdf(this.props.params.compilationId));
  }
  componentWillReceiveProps(nextProps) {
    this.pdfJob = nextProps.queueJobMap[`compilation-${nextProps.compilation._id}`];
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
  renderCompilationSummary() {
    return (<div>
      <h3>Summary</h3>
      <div>Pages: {this.props.compilationPages.length}</div>
      <div>Emails: {this.props.compilationEmails.length}</div>
    </div>);
  }
  renderCompilationPdf() {
    if (this.pdfJob) {
      return (<div>
        <h3>Building new PDF</h3>
        <JobStatus job={this.pdfJob} />
      </div>);
    } else if (this.props.compilation.pdf) {
      return (<div>
        <div>PDF Last Updated: {moment(this.props.compilation.pdf.updatedAt).fromNow()}</div>
        <a target="_blank" href={this.props.compilation.pdf.url}>View Pdf</a>
      </div>);
    }
  }
  // renderBuildCompilationButton() {
  //   return (<div
  //     className="btn btn-default btn-block"
  //     onClick={() => {this.props.dispatch(Actions.getCompilationPdf(this.props.params.compilationId));}} // eslint-disable-line
  //   >
  //     Generate PDF
  //   </div>);
  // }
  render() {
    return (<div>
      <div className="row">
        <div className="col-md-3">
          {this.renderCompilationSummary()}
        </div>
        <div className="col-md-9">
          {this.renderCompilationPdf()}
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(store) {
  return {
    queueJobMap: store.queueJobMap,
    compilationEmails: store.compilationEmails,
    compilationPages: store.compilationPages,
  };
}

CompilationPreviewContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

CompilationPreviewContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.object,
  compilation: PropTypes.object.isRequired,
  compilationEmails: PropTypes.array.isRequired,
  compilationPages: PropTypes.array.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(CompilationPreviewContainer);
