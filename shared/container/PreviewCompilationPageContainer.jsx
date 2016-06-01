import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import CompilationPagePdf from '../components/CompilationPagePdf';
import CompilationPageNavContainer from './CompilationPageNavContainer';
import JobStatus from '../components/JobStatus';
import * as Actions from '../redux/actions/index';

class PreviewCompilationPageContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.pdfJob = this.props.queueJobMap[`page-${this.props.currentPage._id}`];
  }
  componentDidMount() {
    if (!this.props.currentPage.pdf || this.props.currentPage.updatedAt > this.props.currentPage.pdf.modelVersion) {
      this.props.dispatch(Actions.getCompilationPagePdf(this.props.currentPage._compilation, this.props.currentPage));
    }
  }
  componentWillReceiveProps(nextProps) {
    this.pdfJob = nextProps.queueJobMap[`page-${nextProps.currentPage._id}`];
  }
  renderPreview() {
    if (this.pdfJob) {
      return (<div>
        <h3>Building new PDF</h3>
        <JobStatus job={this.pdfJob} />
      </div>);
    } else if (this.props.currentPage.pdf) {
      return (<div>
        <CompilationPageNavContainer compilation={this.props.compilation} currentPage={this.props.currentPage} active="preview" />
        <CompilationPagePdf page={this.props.currentPage} />
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

PreviewCompilationPageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  compilation: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(PreviewCompilationPageContainer);
