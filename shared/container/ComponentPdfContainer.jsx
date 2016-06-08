import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import JobStatus from '../components/JobStatus';
import * as Actions from '../redux/actions/index';
import Pdf from '../components/Pdf';

class ComponentPdfContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.componentModel = this.props.component.mid ? 'email' : 'page';
    this.pdfJob = this.props.queueJobMap[`${this.componentModel}-${this.props.component._id}`];
  }
  componentDidMount() {
    if (!this.componentPdfCurrent()
    || this.componentModel === 'page' && this.props.component.type === 'table-of-contents') {
      if (this.componentModel === 'email') {
        this.props.dispatch(Actions.getCompilationEmailPdf(this.props.component._compilation, this.props.component));
      } else if (this.componentModel === 'page') {
        this.props.dispatch(Actions.getCompilationPagePdf(this.props.component._compilation, this.props.component));
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.pdfJob = nextProps.queueJobMap[`${this.componentModel}-${nextProps.component._id}`];
  }
  componentPdfCurrent() {
    return this.props.component.pdf && this.props.component.updatedAt <= this.props.component.pdf.modelVersion;
  }
  renderPreview() {
    if (this.pdfJob) {
      return <div className="bottom-bumper"><JobStatus job={this.pdfJob} /></div>;
    } else if (!this.componentPdfCurrent()) {
      return <div className="box bottom-bumper">Rebuilding Pdf.</div>;
    } else if (this.props.component.pdf) {
      return <Pdf onPagesComplete={this.props.onPagesComplete} pdf={this.props.component.pdf} file={this.props.component.pdf.url} pages={this.props.component.pdf.pageCount} />;
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

ComponentPdfContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  component: PropTypes.object.isRequired,
  queueJobMap: PropTypes.object.isRequired,
  onPagesComplete: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(ComponentPdfContainer);
