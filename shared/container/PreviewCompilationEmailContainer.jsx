import React, { PropTypes, Component } from 'react';
import CompilationEmailNavContainer from './CompilationEmailNavContainer';
import CompilationEmailPdf from '../components/CompilationEmailPdf';
import JobStatus from '../components/JobStatus';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/index';

class PreviewCompilationEmailContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.pdfJob = this.props.queueJobMap[`email-${this.props.currentEmail._id}`];
  }
  componentDidMount() {
    if (!this.props.currentEmail.pdf || this.props.currentEmail.updatedAt > this.props.currentEmail.pdf.modelVersion) {
      this.props.dispatch(Actions.getCompilationEmailPdf(this.props.currentEmail._compilation, this.props.currentEmail));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.pdfJob = nextProps.queueJobMap[`email-${nextProps.currentEmail._id}`];
  }
  renderPreview() {
    if (this.pdfJob) {
      return (<div>
        <h3>Building new PDF</h3>
        <JobStatus job={this.pdfJob} />
      </div>);
    } else if (this.props.currentEmail.pdf) {
      return (<div className="compilation-email-preview">
        <CompilationEmailNavContainer compilation={this.props.compilation} currentEmail={this.props.currentEmail} active="preview" />
        <CompilationEmailPdf email={this.props.currentEmail} />
      </div>);
    }
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
